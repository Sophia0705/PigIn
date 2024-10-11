package com.ssafy.myssafydata.controller;

import com.ssafy.myssafydata.entity.UserEntity;
import com.ssafy.myssafydata.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping()
    public String findAllUsers(Model model) {
        List<UserEntity> users = userService.findAllUsers();
        model.addAttribute("users", users);
        return "users";
    }

    @GetMapping("/add")
    public String addUserPage() {
        return "addUser";
    }

    @PostMapping("/add")
    public String addUser(String email, String name, String phoneNumber ,String birth) {
        log.info("add user {}", email);

        UserEntity user = UserEntity.builder()
                .email(email)
                .name(name)
                .phoneNumber(phoneNumber)
                .birth(birth)
                .build();

        UserEntity result = userService.userAdd(user);

        if (result != null) {
            return "redirect:/users";
        }
        return "redirect:/users/add";
    }




}
