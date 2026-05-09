package com.primetrade.taskmanager.service;

import com.primetrade.taskmanager.dto.request.TaskRequest;
import com.primetrade.taskmanager.dto.response.TaskResponse;
import com.primetrade.taskmanager.entity.Task;
import com.primetrade.taskmanager.entity.User;
import com.primetrade.taskmanager.exception.BadRequestException;
import com.primetrade.taskmanager.exception.ResourceNotFoundException;
import com.primetrade.taskmanager.repository.TaskRepository;
import com.primetrade.taskmanager.repository.UserRepository;
import com.primetrade.taskmanager.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    public TaskResponse createTask(TaskRequest request) {
        User user = getCurrentUser();
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .user(user)
                .build();
        return TaskResponse.from(taskRepository.save(task));
    }

    public Page<TaskResponse> getMyTasks(Pageable pageable) {
        User user = getCurrentUser();
        return taskRepository.findByUser(user, pageable).map(TaskResponse::from);
    }

    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        if (!isAdmin()) throw new AccessDeniedException("Admin access required");
        return taskRepository.findAll(pageable).map(TaskResponse::from);
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        if (!isAdmin() && !task.getUser().getId().equals(getCurrentUser().getId())) {
            throw new AccessDeniedException("You do not own this task");
        }
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        if (!isAdmin() && !task.getUser().getId().equals(getCurrentUser().getId())) {
            throw new AccessDeniedException("You do not own this task");
        }
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        return TaskResponse.from(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        if (!isAdmin() && !task.getUser().getId().equals(getCurrentUser().getId())) {
            throw new AccessDeniedException("You do not own this task");
        }
        taskRepository.delete(task);
    }
}
