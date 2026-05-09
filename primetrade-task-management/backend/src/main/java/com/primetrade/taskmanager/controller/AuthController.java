package com.primetrade.taskmanager.controller;

import com.primetrade.taskmanager.dto.request.LoginRequest;
import com.primetrade.taskmanager.dto.request.RegisterRequest;
import com.primetrade.taskmanager.dto.response.ApiResponse;
import com.primetrade.taskmanager.dto.response.JwtResponse;
import com.primetrade.taskmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with USER or ADMIN role")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(message, null));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and receive JWT token")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwt = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwt));
    }
}
