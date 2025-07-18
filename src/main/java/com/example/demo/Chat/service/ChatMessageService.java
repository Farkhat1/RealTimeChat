package com.example.demo.Chat.service;

import com.example.demo.Chat.entity.ChatMessage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChatMessageService {
    ChatMessage saveChatMessage(ChatMessage chatMessage);

    List<ChatMessage> findChatMessages(String senderId, String recipientId);
}
