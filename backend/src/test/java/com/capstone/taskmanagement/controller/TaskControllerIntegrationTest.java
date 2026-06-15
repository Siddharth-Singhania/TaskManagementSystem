package com.capstone.taskmanagement.controller;

import com.capstone.taskmanagement.dto.TaskRequest;
import com.capstone.taskmanagement.model.Priority;
import com.capstone.taskmanagement.model.Task;
import com.capstone.taskmanagement.model.TaskStatus;
import com.capstone.taskmanagement.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/v1/tasks - creates task and returns 201")
    void createTask_ReturnsCreatedTask() throws Exception {
        TaskRequest request = new TaskRequest();
        request.setTitle("New Task");
        request.setDescription("Task description");
        request.setPriority(Priority.HIGH);
        request.setDueDate(LocalDate.now().plusDays(7));

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("New Task"))
                .andExpect(jsonPath("$.description").value("Task description"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/v1/tasks - returns 400 for missing title")
    void createTask_WithoutTitle_ReturnsBadRequest() throws Exception {
        TaskRequest request = new TaskRequest();
        request.setDescription("Description without title");

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("title")));
    }

    @Test
    @DisplayName("POST /api/v1/tasks - returns 400 for blank title")
    void createTask_WithBlankTitle_ReturnsBadRequest() throws Exception {
        TaskRequest request = new TaskRequest();
        request.setTitle("   ");

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("title")));
    }

    @Test
    @DisplayName("GET /api/v1/tasks - returns all tasks")
    void getAllTasks_ReturnsTaskList() throws Exception {
        createTestTask("Task 1", TaskStatus.TODO);
        createTestTask("Task 2", TaskStatus.IN_PROGRESS);

        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].title", containsInAnyOrder("Task 1", "Task 2")));
    }

    @Test
    @DisplayName("GET /api/v1/tasks - returns empty list when no tasks")
    void getAllTasks_WhenEmpty_ReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /api/v1/tasks/{id} - returns task when exists")
    void getTaskById_WhenExists_ReturnsTask() throws Exception {
        Task task = createTestTask("Test Task", TaskStatus.TODO);

        mockMvc.perform(get("/api/v1/tasks/{id}", task.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(task.getId()))
                .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    @DisplayName("GET /api/v1/tasks/{id} - returns 404 when not found")
    void getTaskById_WhenNotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/v1/tasks/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Task not found"));
    }

    @Test
    @DisplayName("PUT /api/v1/tasks/{id} - updates task successfully")
    void updateTask_WhenExists_ReturnsUpdatedTask() throws Exception {
        Task task = createTestTask("Original Title", TaskStatus.TODO);

        TaskRequest updateRequest = new TaskRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setDescription("Updated description");
        updateRequest.setStatus(TaskStatus.IN_PROGRESS);
        updateRequest.setPriority(Priority.HIGH);

        mockMvc.perform(put("/api/v1/tasks/{id}", task.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.priority").value("HIGH"));
    }

    @Test
    @DisplayName("PUT /api/v1/tasks/{id} - returns 404 when not found")
    void updateTask_WhenNotFound_Returns404() throws Exception {
        TaskRequest request = new TaskRequest();
        request.setTitle("Updated Title");

        mockMvc.perform(put("/api/v1/tasks/{id}", 99999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/tasks/{id} - deletes task and returns 204")
    void deleteTask_WhenExists_Returns204() throws Exception {
        Task task = createTestTask("Task to delete", TaskStatus.TODO);

        mockMvc.perform(delete("/api/v1/tasks/{id}", task.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/tasks/{id}", task.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/tasks/{id} - returns 404 when not found")
    void deleteTask_WhenNotFound_Returns404() throws Exception {
        mockMvc.perform(delete("/api/v1/tasks/{id}", 99999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("API responses are valid JSON")
    void apiResponses_AreValidJson() throws Exception {
        Task task = createTestTask("JSON Test", TaskStatus.TODO);

        mockMvc.perform(get("/api/v1/tasks/{id}", task.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    private Task createTestTask(String title, TaskStatus status) {
        Task task = new Task();
        task.setTitle(title);
        task.setStatus(status);
        task.setPriority(Priority.MEDIUM);
        return taskRepository.save(task);
    }
}
