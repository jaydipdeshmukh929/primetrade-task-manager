package com.primetrade.taskmanager.controller;

import com.primetrade.taskmanager.dto.response.ApiResponse;
import com.primetrade.taskmanager.entity.User;
import com.primetrade.taskmanager.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only management endpoints")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    @Operation(summary = "Get all users (ADMIN only)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "role", u.getRole().name(),
                        "enabled", u.isEnabled(),
                        "createdAt", u.getCreatedAt()
                ))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @GetMapping("/stats")
    @Operation(summary = "Dashboard stats (ADMIN only)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        long totalUsers = userRepository.count();
        long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ROLE_ADMIN).count();
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved", Map.of(
                "totalUsers", totalUsers,
                "adminCount", adminCount,
                "userCount", totalUsers - adminCount
        )));
    }
}
