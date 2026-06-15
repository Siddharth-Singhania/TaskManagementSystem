package com.capstone.taskmanagement.service;

import com.capstone.taskmanagement.dto.TaskRequest;
import com.capstone.taskmanagement.dto.TaskResponse;
import com.capstone.taskmanagement.exception.TaskNotFoundException;
import com.capstone.taskmanagement.model.Priority;
import com.capstone.taskmanagement.model.Task;
import com.capstone.taskmanagement.model.TaskStatus;
import com.capstone.taskmanagement.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task testTask;
    private TaskRequest testRequest;

    @BeforeEach
    void setUp() {
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setStatus(TaskStatus.TODO);
        testTask.setPriority(Priority.MEDIUM);
        testTask.setDueDate(LocalDate.now().plusDays(7));
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUpdatedAt(LocalDateTime.now());

        testRequest = new TaskRequest();
        testRequest.setTitle("Test Task");
        testRequest.setDescription("Test Description");
        testRequest.setPriority(Priority.MEDIUM);
        testRequest.setDueDate(LocalDate.now().plusDays(7));
    }

    @Test
    @DisplayName("Create task with valid input should return created task")
    void createTask_WithValidInput_ReturnsCreatedTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse response = taskService.createTask(testRequest);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo(testRequest.getTitle());
        assertThat(response.getDescription()).isEqualTo(testRequest.getDescription());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Create task should apply default status TODO")
    void createTask_ShouldApplyDefaultStatusTodo() {
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task saved = invocation.getArgument(0);
            saved.setId(1L);
            saved.setCreatedAt(LocalDateTime.now());
            saved.setUpdatedAt(LocalDateTime.now());
            return saved;
        });

        TaskResponse response = taskService.createTask(testRequest);

        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
    }

    @Test
    @DisplayName("Create task should apply default priority MEDIUM when not provided")
    void createTask_ShouldApplyDefaultPriorityMedium() {
        TaskRequest requestWithoutPriority = new TaskRequest();
        requestWithoutPriority.setTitle("Task without priority");

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task saved = invocation.getArgument(0);
            saved.setId(1L);
            saved.setCreatedAt(LocalDateTime.now());
            saved.setUpdatedAt(LocalDateTime.now());
            return saved;
        });

        TaskResponse response = taskService.createTask(requestWithoutPriority);

        assertThat(response.getPriority()).isEqualTo(Priority.MEDIUM);
    }

    @Test
    @DisplayName("Get all tasks should return list of tasks")
    void getAllTasks_ReturnsListOfTasks() {
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setStatus(TaskStatus.IN_PROGRESS);
        task2.setPriority(Priority.HIGH);
        task2.setCreatedAt(LocalDateTime.now());
        task2.setUpdatedAt(LocalDateTime.now());

        when(taskRepository.findAll()).thenReturn(Arrays.asList(testTask, task2));

        List<TaskResponse> tasks = taskService.getAllTasks();

        assertThat(tasks).hasSize(2);
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
        assertThat(tasks.get(1).getTitle()).isEqualTo("Task 2");
    }

    @Test
    @DisplayName("Get task by ID should return task when exists")
    void getTaskById_WhenTaskExists_ReturnsTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        TaskResponse response = taskService.getTaskById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Test Task");
    }

    @Test
    @DisplayName("Get task by ID should throw exception when not found")
    void getTaskById_WhenTaskNotFound_ThrowsException() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(999L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("Update task should modify all fields")
    void updateTask_ModifiesAllFields() {
        TaskRequest updateRequest = new TaskRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setDescription("Updated Description");
        updateRequest.setStatus(TaskStatus.IN_PROGRESS);
        updateRequest.setPriority(Priority.HIGH);
        updateRequest.setDueDate(LocalDate.now().plusDays(14));

        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskResponse response = taskService.updateTask(1L, updateRequest);

        assertThat(response.getTitle()).isEqualTo("Updated Title");
        assertThat(response.getDescription()).isEqualTo("Updated Description");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(response.getPriority()).isEqualTo(Priority.HIGH);
    }

    @Test
    @DisplayName("Update task should throw exception when not found")
    void updateTask_WhenTaskNotFound_ThrowsException() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(999L, testRequest))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    @DisplayName("Delete task should remove record when exists")
    void deleteTask_WhenTaskExists_RemovesRecord() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Delete task should throw exception when not found")
    void deleteTask_WhenTaskNotFound_ThrowsException() {
        when(taskRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(999L))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, never()).deleteById(any());
    }
}
