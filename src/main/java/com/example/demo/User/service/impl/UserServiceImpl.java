package com.example.demo.User.service.impl;

import com.example.demo.User.entity.Status;
import com.example.demo.User.entity.User;
import com.example.demo.User.repository.UserRepository;
import com.example.demo.User.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        userRepository.save(user);
    }

    @Override
    public void disconnect(User user) {
        var storedUser = userRepository.findByUsername(user.getUsername());

        if (storedUser != null && storedUser.getStatus() != Status.ONLINE) {
            storedUser.setStatus(Status.OFFLINE);
            userRepository.save(storedUser);
        }
    }

    @Override
    public List<User> findAllByStatus() {
        return userRepository.findAllByStatus(Status.ONLINE);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
