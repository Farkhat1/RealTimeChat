package com.example.demo.User.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.User.entity.Status;
import com.example.demo.User.entity.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByStatus(Status status);

    User findByUsername(String username);

}
