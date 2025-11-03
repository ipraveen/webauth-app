package com.myapp.store.services;

import com.myapp.store.config.JwtConfig;
import com.myapp.store.entities.Roles;
import com.myapp.store.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    private String generateJwtToken(User user, long duration) {

        List<String> roles = user.getRoles().stream().map(Roles::getName).toList();
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + (duration * 1000)))
                .signWith(Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes()))

                .compact();
    }

    public String generateAccessToken(User user) {
        return generateJwtToken(user, jwtConfig.getAccessTokenExp()); // 5m
    }

    public String generateRefreshToken(User user) {
        return generateJwtToken(user, jwtConfig.getRefreshTokenExp()); // 10m: 600  7d: 604800
    }

    public boolean validateToken(String token) {

        try {
            var claims = getJwtClaim(token);
            System.out.println("getExpiration: " + claims.getExpiration());
            System.out.println("getExpiration: Test: " + claims.getExpiration().after(new Date()));
            return claims.getExpiration().after(new Date());
        } catch (JwtException e) {
            return false;
        }
    }

    public Long getIdFromToken(String token) {

        try {
            var claims = getJwtClaim(token);
            return Long.valueOf(claims.getSubject());
        } catch (JwtException e) {
            return null;
        }
    }

    public String getRoleFromToken(String token) {

        try {
            var claims = getJwtClaim(token);
            return claims.get("role", String.class);
        } catch (JwtException e) {
            return null;
        }
    }

    private Claims getJwtClaim(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
