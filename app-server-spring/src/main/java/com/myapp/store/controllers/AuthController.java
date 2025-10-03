package com.myapp.store.controllers;

import com.myapp.store.config.JwtConfig;
import com.myapp.store.dtos.JwtResponse;
import com.myapp.store.dtos.LoginDto;
import com.myapp.store.dtos.UserDto;
import com.myapp.store.mappers.UserMapper;
import com.myapp.store.repositories.UserRepository;
import com.myapp.store.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final JwtConfig jwtConfig;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginDto loginDto, HttpServletResponse response) {
        System.out.println("Inside login");
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

//        var user = userRepository.findByEmail(loginDto.getEmail()).orElse(null);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        }

        System.out.println("Authenticated user: " + loginDto.getEmail());
        var user = userRepository.findByEmail(loginDto.getEmail()).orElse(null);

        var token = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);


        var cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExp()); // 10m
        cookie.setSecure(true);

        response.addCookie(cookie);

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@CookieValue("refresh_token") String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Refresh token valid, regenrate access token

        var userId = jwtService.getIdFromToken(refreshToken);
        var user = userRepository.findById(userId).orElseThrow();
        var accessToken = jwtService.generateAccessToken(user);
        return ResponseEntity.ok(new JwtResponse(accessToken));

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
