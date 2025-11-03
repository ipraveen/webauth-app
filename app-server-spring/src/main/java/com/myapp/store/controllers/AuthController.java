package com.myapp.store.controllers;

import com.myapp.store.config.JwtConfig;
import com.myapp.store.dtos.LoginDto;
import com.myapp.store.dtos.LoginResponse;
import com.myapp.store.dtos.UserDto;
import com.myapp.store.entities.Roles;
import com.myapp.store.mappers.UserMapper;
import com.myapp.store.repositories.UserRepository;
import com.myapp.store.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@Slf4j
public class AuthController {
    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final JwtConfig jwtConfig;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginDto loginDto, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        var user = userRepository.findByEmail(loginDto.getEmail()).orElse(null);
        var token = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        var cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "None");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExp()); // 10m
        cookie.setSecure(true);

        response.addCookie(cookie);

        List<String> roles = user.getRoles().stream().map(Roles::getName).toList();
        return ResponseEntity.ok(new LoginResponse(user.getName(), roles, token));
    }

    @GetMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@CookieValue("refresh_token") String refreshToken) {

        log.info("==> Refresh token: {}", refreshToken);
        if (!jwtService.validateToken(refreshToken)) {
            log.info("==> Refresh token Invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Refresh token valid, regenrate access token

        var userId = jwtService.getIdFromToken(refreshToken);
        var user = userRepository.findById(userId).orElseThrow();
        var accessToken = jwtService.generateAccessToken(user);

        List<String> roles = user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList());

        return ResponseEntity.ok(new LoginResponse(user.getName(), roles, accessToken));

    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var id = authentication.getPrincipal();
        var user = userRepository.findById(Long.valueOf(id.toString())).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userMapper.toDto(user));
    }
}
