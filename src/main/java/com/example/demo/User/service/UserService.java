package com.example.demo.User.service;

import java.util.List;

import com.example.demo.User.entity.Status;
import com.example.demo.User.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    void saveUser(User user);

    void disconnect(User user);

    List<User> findAllByStatus();

    User findByUsername(String username);

}
