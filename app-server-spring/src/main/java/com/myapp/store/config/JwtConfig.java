package com.myapp.store.config;

import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
@ConfigurationProperties(prefix = "spring.jwt")
@Data
public class JwtConfig {

    private String secret;

    private int accessTokenExp;

    private int refreshTokenExp;

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(this.getSecret().getBytes());
    }
}
