'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message'); //Первый
const connectingElement = document.querySelector('.connectin');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');

let stompClient = null;
let username = null;
let fullname = null;
let selectedUserId = null;

async function fetchCurrentUser() {
    const response = await fetch('current-user');
    const user = await response.json();
    username = user.username;
    fullname = user.fullname;
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchCurrentUser();
    if (document.querySelector('#chat-page')) {
    connect();
    }
});

function connect() {
    if (username && fullname) {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket); //Second

        stompClient.connect({}, onConnected, onError);
    }
}

function onConnected() {
    stompClient.subscribe(`/user/${username}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/public`, onMessageReceived);

    stompClient.send("/app/user.addUser", {}, JSON.stringify({username: username, fullName: fullname, status: "ONLINE"})); //Third and fourth
    document.querySelector('#connected-user-fullname').textContent = fullname;
    chatPage.classList.remove('hidden');
    findAndDisplayConnectedUser().then();
}

async function findAndDisplayConnectedUser() {
    const connectedUsersResponse = await fetch("/users");
    let connectedUsers = await connectedUsersResponse.json();

    connectedUsers = connectedUsers.filter(user => user.username != username);
    const connectedUserList = document.getElementById('connectedUsers');
    connectedUserList.innerHTML = '';

    connectedUsers.forEach(user => {
        appendUserElement(user, connectedUserList);
        if (connectedUsers.indexOf(user) < connectedUsers.length - 1) {
            const separator = document.createElement('li');
            separator.classList.add('separator');
            connectedUserList.appendChild(separator);
        }
    });
}

function appendUserElement(user, connectedUserList) {
    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = user.username;
    const userImage = document.createElement('img');
    userImage.src = '../img/user_icon.png';
    userImage.alt = user.fullName;

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.fullName;

    const receivedMsg = document.createElement('span');
    receivedMsg.textContent = '0';
    receivedMsg.classList.add('nbr-msg', 'hidden');
    listItem.appendChild(userImage);
    listItem.appendChild(usernameSpan);
    listItem.appendChild(receivedMsg);

    listItem.addEventListener('click', userItemClick);
    connectedUserList.appendChild(listItem);
}

function userItemClick(event) {
    document.querySelectorAll('.user-item').forEach(item => { // Fifth
        item.classList.remove('active');
    });
    messageForm.classList.remove('hidden');
    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');
    selectedUserId = clickedUser.getAttribute('id');
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUser.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';
}

function displayMessage(senderId, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message'); //Sixth
    if (senderId === username) {
        messageContainer.classList.add('sender');
    } else {
        messageContainer.classList.add('receiver');
    }

    const message = document.createElement('p');
    message.textContent = content;
    messageContainer.appendChild(message);
    chatArea.appendChild(messageContainer);
}

async function fetchAndDisplayUserChat() {
    const userChatResponse = await fetch(`/messages/${username}/${selectedUserId}`);
    const userChat = await userChatResponse.json();
    chatArea.innerHTML = '';
    userChat.forEach(chat => {
        displayMessage(chat.senderId, chat.content);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
        senderId: username, //Seventh
        recipientId: selectedUserId,
        content: messageInput.value.trim(),
        timestamp: new Date(); //Eighth and Nineth
        };
        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        displayMessage(username, messageInput.value.trim());
        messageInput.value = '';
    }
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}

async function onMessageReceived(payload) {
    await findAndDisplayConnectedUser();
    console.log('Message received', payload);
    const message = JSON.parse(payload.body);
    if (selectedUserId && selectedUserId === message.senderId) {
        displayMessage(message.senderId, message.content);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    if (selectedUserId) {
        document.querySelector(`#${selectedUserId}`).classList.add('active');
    } else {
        messageForm.classList.add('hidden');
    }

    const notifiedUser = document.querySelector(`#${message.senderId}`);
    if (notifiedUser && !notifiedUser.classList.contains('active')) {
        const nbrMsg = notifiedUser.querySelector('.nbr-msg');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = '';
    }
}

let hasLoggedOut = false;

function onLogout() {
    if (hasLoggedOut) return;
    hasLoggedOut = true;

    if (stompClient && stompClient.connected) {
        stompClient.send('/app/user.disconnectUser', {}, JSON.stringify({username: username, fullName: fullname, status: 'OFFLINE'}));
    }
    window.location.reload();
}

messageForm.addEventListener('submit', sendMessage, true);
logout.addEventListener('click', onLogout, true);
window.addEventListener('beforeunload', () => {
    const isReload = window.performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (!isReload) {
        onLogout();
    }
})