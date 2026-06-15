package com.capstone.taskmanagement.service;

import com.capstone.taskmanagement.dto.PagedResponse;
import com.capstone.taskmanagement.dto.TaskRequest;
import com.capstone.taskmanagement.dto.TaskResponse;
import com.capstone.taskmanagement.model.Priority;
import com.capstone.taskmanagement.model.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskRequest request);

    List<TaskResponse> getAllTasks();

    PagedResponse<TaskResponse> getTasksPaginated(int page, int size, TaskStatus status, Priority priority, String sortBy, String sortDir);

    TaskResponse getTaskById(Long id);

    TaskResponse updateTask(Long id, TaskRequest request);

    void deleteTask(Long id);
}
