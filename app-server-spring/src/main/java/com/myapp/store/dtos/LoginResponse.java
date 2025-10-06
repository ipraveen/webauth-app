package com.myapp.store.dtos;

import com.myapp.store.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginResponse {
    private String name;

    private Role role;

    private String token;
}
