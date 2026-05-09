package com.primetrade.taskmanager.controller;

import com.primetrade.taskmanager.dto.request.TaskRequest;
import com.primetrade.taskmanager.dto.response.ApiResponse;
import com.primetrade.taskmanager.dto.response.TaskResponse;
import com.primetrade.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/tasks")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tasks", description = "CRUD operations for tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's tasks (USER & ADMIN)")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getMyTasks(
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<TaskResponse> tasks = taskService.getMyTasks(pageable);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved", tasks));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all tasks (ADMIN only)")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getAllTasks(
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<TaskResponse> tasks = taskService.getAllTasks(pageable);
        return ResponseEntity.ok(ApiResponse.success("All tasks retrieved", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        TaskResponse task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
