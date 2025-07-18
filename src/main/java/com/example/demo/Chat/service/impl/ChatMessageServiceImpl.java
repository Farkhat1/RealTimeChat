package com.example.demo.Chat.service.impl;

import com.example.demo.Chat.entity.ChatMessage;
import com.example.demo.Chat.repository.ChatMessageRepository;
import com.example.demo.Chat.service.ChatMessageService;
import com.example.demo.ChatRoom.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatRoomService chatRoomService;

    @Override
    public ChatMessage saveChatMessage(ChatMessage chatMessage) {

        var chatId = chatRoomService.getChatRoomId(
                chatMessage.getSenderId(),
                chatMessage.getRecipientId(),
                true
        ).orElseThrow();

        chatMessage.setChatId(chatId);
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    @Override
    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        return chatId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }
}
