package com.myapp.store.dtos;

import com.myapp.store.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class LoginResponse {
    private String name;

    private List<String> roles;

    private String token;
}
