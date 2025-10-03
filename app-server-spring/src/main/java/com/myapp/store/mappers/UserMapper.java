package com.myapp.store.mappers;

import com.myapp.store.dtos.UserCreateRequestDto;
import com.myapp.store.dtos.UserDto;
import com.myapp.store.dtos.UserUpdateRequestDto;
import com.myapp.store.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    UserDto toDto(User user);


    User toEntity(UserCreateRequestDto request);

    void updateUser(UserUpdateRequestDto requestDto, @MappingTarget User user);
}
