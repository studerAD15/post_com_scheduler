package com.postscheduler.backend.service;

import com.postscheduler.backend.dto.auth.LoginRequestDto;
import com.postscheduler.backend.dto.auth.LoginResponseDto;
import com.postscheduler.backend.dto.auth.UserResponseDto;
import com.postscheduler.backend.model.Role;
import com.postscheduler.backend.model.User;
import com.postscheduler.backend.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByUsernameIgnoreCase(dto.getUsername().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        String token = jwtService.generateToken(user);
        UserResponseDto userDto = mapToUserDto(user);
        return new LoginResponseDto(token, userDto);
    }

    public UserResponseDto register(String username, String name, String email, Role role, String rawPassword, String avatarUrl) {
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }

        String id = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        String hash = passwordEncoder.encode(rawPassword);
        User user = new User(id, username, name, email, role, hash, avatarUrl);
        User saved = userRepository.save(user);
        return mapToUserDto(saved);
    }

    public UserResponseDto mapToUserDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getAvatarUrl()
        );
    }
}
