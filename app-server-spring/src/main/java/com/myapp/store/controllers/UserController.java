package com.myapp.store.controllers;

import com.myapp.store.dtos.ChangePasswordDto;
import com.myapp.store.dtos.UserCreateRequestDto;
import com.myapp.store.dtos.UserDto;
import com.myapp.store.dtos.UserUpdateRequestDto;
import com.myapp.store.entities.Role;
import com.myapp.store.mappers.UserMapper;
import com.myapp.store.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Set;


@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserDto> getAllUsers(@RequestParam(required = false, defaultValue = "", name = "sort") String sort) {

        if (!Set.of("name", "email").contains(sort)) {
            sort = "name";
        }

        return userRepository.findAll(Sort.by(sort))
                .stream()
                .map(user -> userMapper.toDto(user))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable long id) {
        var user = userRepository.findById(id).orElse(null);

        // Result in 404
        if (user == null) return ResponseEntity.notFound().build();

        // Result in 200 with Data
        return ResponseEntity.ok(userMapper.toDto(user));
    }


    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserCreateRequestDto userCreateRequestDto, UriComponentsBuilder uriBuilder) {

        System.out.println("Creating user: " + userCreateRequestDto);

        var userEntity = userMapper.toEntity(userCreateRequestDto);

        userEntity.setPassword(passwordEncoder.encode(userCreateRequestDto.getPassword()));
        userEntity.setRoles(userCreateRequestDto.getRole());

        var user = userRepository.save(userEntity);
        var uri = uriBuilder.path("/users/{id}").buildAndExpand(user.getId()).toUri();

        // To provide Status 201: Created
        // To Provide Header: Location = http://localhost:8080/users/4
        return ResponseEntity.created(uri).body(userMapper.toDto(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable long id,
            @RequestBody UserUpdateRequestDto userUpdateRequestDto
    ) {
        var user = userRepository.findById(id).orElse(null);

        // Result in 404
        if (user == null) return ResponseEntity.notFound().build();

        userMapper.updateUser(userUpdateRequestDto, user);
        userRepository.save(user);

        // Result in 200 with Data
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable long id
    ) {
        var user = userRepository.findById(id).orElse(null);

        // Result in 404
        if (user == null) return ResponseEntity.notFound().build();

        userRepository.delete(user);

        // Result in 200 with Data
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(
            @PathVariable long id,
            @RequestBody ChangePasswordDto changePasswordDto
    ) {
        var user = userRepository.findById(id).orElse(null);

        // Result in 404
        if (user == null) return ResponseEntity.notFound().build();

        if (!changePasswordDto.getOldPassword().equals(user.getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        user.setPassword(changePasswordDto.getNewPassword());

        userRepository.save(user);

        // Result in 200 with Data
        return ResponseEntity.noContent().build();
    }

}
