package com.example.demo.Chat.entity;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Builder
public class ChatNotification {

    private Long id;
//    private String chatId;
    private String senderId;
    private String recipientId;
    private String content;

}
