package com.primetrade.taskmanager.dto.request;

import com.primetrade.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 100, message = "Title must be 1-100 characters")
    private String title;

    @Size(max = 1000, message = "Description max 1000 characters")
    private String description;

    private Task.Status status;

    private Task.Priority priority;
}
