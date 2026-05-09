package com.primetrade.taskmanager.repository;

import com.primetrade.taskmanager.entity.Task;
import com.primetrade.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByUser(User user, Pageable pageable);
    Page<Task> findByUserAndStatus(User user, Task.Status status, Pageable pageable);
    long countByUser(User user);
}
