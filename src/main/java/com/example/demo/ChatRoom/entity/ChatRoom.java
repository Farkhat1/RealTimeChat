package com.example.demo.ChatRoom.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chatroom")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chatId;
    private String senderId;
    private String recipientId;


}
