package com.capstone.taskmanagement.service;

import com.capstone.taskmanagement.dto.PagedResponse;
import com.capstone.taskmanagement.dto.TaskRequest;
import com.capstone.taskmanagement.dto.TaskResponse;
import com.capstone.taskmanagement.exception.TaskNotFoundException;
import com.capstone.taskmanagement.model.Priority;
import com.capstone.taskmanagement.model.Task;
import com.capstone.taskmanagement.model.TaskStatus;
import com.capstone.taskmanagement.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");
    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        // Input sanitization
        String sanitizedTitle = sanitizeInput(request.getTitle());
        String sanitizedDescription = sanitizeInput(request.getDescription());

        Task task = new Task();
        task.setTitle(sanitizedTitle);
        task.setDescription(sanitizedDescription);
        task.setStatus(TaskStatus.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setDueDate(request.getDueDate());

        Task savedTask = taskRepository.save(task);
        
        // Audit logging
        auditLog.info("TASK_CREATED: id={}, title={}", savedTask.getId(), sanitizedTitle);
        
        return TaskResponse.fromEntity(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getTasksPaginated(int page, int size, TaskStatus status, Priority priority, String sortBy, String sortDir) {
        // Validate and cap page size
        size = Math.min(size, 100);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Task> taskPage = taskRepository.findByFilters(status, priority, pageable);
        
        List<TaskResponse> content = taskPage.getContent()
                .stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
        
        return new PagedResponse<>(
                content,
                taskPage.getNumber(),
                taskPage.getSize(),
                taskPage.getTotalElements(),
                taskPage.getTotalPages(),
                taskPage.isFirst(),
                taskPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return TaskResponse.fromEntity(task);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        // Store old values for audit
        String oldTitle = task.getTitle();
        TaskStatus oldStatus = task.getStatus();

        // Input sanitization
        task.setTitle(sanitizeInput(request.getTitle()));
        task.setDescription(sanitizeInput(request.getDescription()));
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        
        // Audit logging
        auditLog.info("TASK_UPDATED: id={}, oldTitle={}, newTitle={}, oldStatus={}, newStatus={}", 
                id, oldTitle, updatedTask.getTitle(), oldStatus, updatedTask.getStatus());
        
        return TaskResponse.fromEntity(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
        
        // Audit logging
        auditLog.info("TASK_DELETED: id={}", id);
    }

    /**
     * Sanitizes user input by trimming whitespace and removing potentially harmful content
     */
    private String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        // Trim whitespace
        String sanitized = input.trim();
        // Remove potential script tags and HTML
        sanitized = sanitized.replaceAll("<[^>]*>", "");
        // Remove null bytes
        sanitized = sanitized.replace("\0", "");
        return sanitized;
    }
}
