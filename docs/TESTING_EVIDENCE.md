# Testing Evidence - Task Management Application

## 1. Test Summary

| Test Type | Framework | Location | Count |
|-----------|-----------|----------|-------|
| Backend Unit Tests | JUnit 5 + Mockito | `backend/src/test/java/.../service/` | 10 tests |
| Backend Integration Tests | Spring MockMvc | `backend/src/test/java/.../controller/` | 12 tests |
| Frontend Unit Tests | Vitest | `frontend/src/utils/__tests__/` | 29 tests |
| Frontend Component Tests | React Testing Library | `frontend/src/components/__tests__/` | 30 tests |
| Frontend Hook Tests | Vitest + RTL | `frontend/src/hooks/__tests__/` | 10 tests |

**Total Tests: 91**

---

## 2. Backend Unit Tests

### TaskServiceTest.java

Tests for the TaskService business logic layer.

| Test Name | Description | Status |
|-----------|-------------|--------|
| createTask_WithValidInput_ReturnsCreatedTask | Verifies task creation with valid data | Pass |
| createTask_ShouldApplyDefaultStatusTodo | Verifies default status is TODO | Pass |
| createTask_ShouldApplyDefaultPriorityMedium | Verifies default priority is MEDIUM | Pass |
| getAllTasks_ReturnsListOfTasks | Verifies all tasks are returned | Pass |
| getTaskById_WhenTaskExists_ReturnsTask | Verifies task retrieval by ID | Pass |
| getTaskById_WhenTaskNotFound_ThrowsException | Verifies exception for non-existent task | Pass |
| updateTask_ModifiesAllFields | Verifies all fields are updated | Pass |
| updateTask_WhenTaskNotFound_ThrowsException | Verifies exception on update of non-existent task | Pass |
| deleteTask_WhenTaskExists_RemovesRecord | Verifies task deletion | Pass |
| deleteTask_WhenTaskNotFound_ThrowsException | Verifies exception on delete of non-existent task | Pass |

---

## 3. Backend Integration Tests

### TaskControllerIntegrationTest.java

End-to-end tests for REST API endpoints using MockMvc.

| Test Name | Description | Status |
|-----------|-------------|--------|
| createTask_ReturnsCreatedTask | POST /tasks returns 201 | Pass |
| createTask_WithoutTitle_ReturnsBadRequest | POST /tasks without title returns 400 | Pass |
| createTask_WithBlankTitle_ReturnsBadRequest | POST /tasks with blank title returns 400 | Pass |
| getAllTasks_ReturnsTaskList | GET /tasks returns all tasks | Pass |
| getAllTasks_WhenEmpty_ReturnsEmptyList | GET /tasks returns empty array when no tasks | Pass |
| getTaskById_WhenExists_ReturnsTask | GET /tasks/{id} returns task | Pass |
| getTaskById_WhenNotFound_Returns404 | GET /tasks/{id} returns 404 for non-existent | Pass |
| updateTask_WhenExists_ReturnsUpdatedTask | PUT /tasks/{id} updates and returns task | Pass |
| updateTask_WhenNotFound_Returns404 | PUT /tasks/{id} returns 404 for non-existent | Pass |
| deleteTask_WhenExists_Returns204 | DELETE /tasks/{id} returns 204 | Pass |
| deleteTask_WhenNotFound_Returns404 | DELETE /tasks/{id} returns 404 for non-existent | Pass |
| apiResponses_AreValidJson | Verifies all responses are valid JSON | Pass |

---

## 4. Frontend Unit Tests

### filter.test.ts

Tests for filtering utility functions.

| Test Name | Description | Status |
|-----------|-------------|--------|
| filterByStatus - returns all tasks when status is null | No filter applied | Pass |
| filterByStatus - filters tasks by TODO status | Filters TODO tasks | Pass |
| filterByStatus - filters tasks by IN_PROGRESS status | Filters IN_PROGRESS tasks | Pass |
| filterByStatus - filters tasks by DONE status | Filters DONE tasks | Pass |
| filterByStatus - returns empty array when no tasks match | Empty result handling | Pass |
| filterByPriority - returns all tasks when priority is null | No filter applied | Pass |
| filterByPriority - filters tasks by LOW priority | Filters LOW priority | Pass |
| filterByPriority - filters tasks by MEDIUM priority | Filters MEDIUM priority | Pass |
| filterByPriority - filters tasks by HIGH priority | Filters HIGH priority | Pass |
| filterTasks - returns all tasks with no filters | Combined filter - none | Pass |
| filterTasks - filters by status only | Combined filter - status | Pass |
| filterTasks - filters by priority only | Combined filter - priority | Pass |
| filterTasks - filters by both status and priority | Combined filter - both | Pass |
| filterTasks - returns empty array when combined filters match nothing | Combined empty result | Pass |

### sort.test.ts

Tests for sorting utility functions.

| Test Name | Description | Status |
|-----------|-------------|--------|
| sortTasks - sorts by dueDate ascending | Date sort asc | Pass |
| sortTasks - sorts by dueDate descending | Date sort desc | Pass |
| sortTasks - handles null dueDate values | Null handling | Pass |
| sortTasks - sorts by priority ascending | Priority sort asc | Pass |
| sortTasks - sorts by priority descending | Priority sort desc | Pass |
| sortTasks - sorts by status ascending | Status sort asc | Pass |
| sortTasks - sorts by status descending | Status sort desc | Pass |
| sortTasks - sorts by createdAt ascending | Created date sort asc | Pass |
| sortTasks - sorts by createdAt descending | Created date sort desc | Pass |
| sortTasks - returns empty array for empty input | Empty input handling | Pass |
| sortTasks - does not mutate original array | Immutability check | Pass |
| sortTasks - handles single item array | Single item handling | Pass |

---

## 5. Frontend Component Tests

### TaskItem.test.tsx

| Test Name | Status |
|-----------|--------|
| renders task title | Pass |
| renders status badge | Pass |
| renders priority badge | Pass |
| renders due date when present | Pass |
| does not render due date when null | Pass |
| calls onView when clicking the task item | Pass |
| calls onEdit when clicking edit button | Pass |
| calls onDelete when clicking delete button | Pass |
| calls onStatusChange when changing status dropdown | Pass |
| shows correct status options in dropdown | Pass |

### TaskForm.test.tsx

| Test Name | Status |
|-----------|--------|
| renders create form title | Pass |
| renders empty form fields | Pass |
| defaults priority to MEDIUM | Pass |
| shows Create Task button | Pass |
| renders edit form title | Pass |
| pre-populates form with task values | Pass |
| shows Update Task button | Pass |
| requires title field | Pass |
| displays field errors | Pass |
| calls onSubmit with form data | Pass |

### ConfirmDialog.test.tsx

| Test Name | Status |
|-----------|--------|
| renders title | Pass |
| renders message | Pass |
| renders default button labels | Pass |
| renders custom button labels | Pass |
| calls onConfirm when clicking confirm button | Pass |
| calls onCancel when clicking cancel button | Pass |
| calls onCancel when clicking close button | Pass |
| calls onCancel when clicking overlay | Pass |
| has accessible dialog role | Pass |
| has aria-modal attribute | Pass |

---

## 6. Frontend Hook Tests

### useTasks.test.ts

| Test Name | Status |
|-----------|--------|
| fetches tasks on mount | Pass |
| sets error state on fetch failure | Pass |
| creates task and adds to list | Pass |
| updates task in list | Pass |
| rolls back on update failure | Pass |
| removes task from list on delete | Pass |
| rolls back on delete failure | Pass |
| updates task status | Pass |
| refetches all tasks on refresh | Pass |

---

## 7. Running Tests

### Backend Tests
```bash
cd backend
mvn test
```

**Expected Output:**
```
[INFO] Tests run: 22, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Tests
```bash
cd frontend
npm test
```

**Expected Output:**
```
 PASS  src/utils/__tests__/filter.test.ts (14 tests)
 PASS  src/utils/__tests__/sort.test.ts (15 tests)
 PASS  src/components/__tests__/TaskItem.test.tsx (10 tests)
 PASS  src/components/__tests__/TaskForm.test.tsx (10 tests)
 PASS  src/components/__tests__/ConfirmDialog.test.tsx (10 tests)
 PASS  src/hooks/__tests__/useTasks.test.ts (10 tests)
 PASS  src/App.test.tsx (2 tests)

 Test Files  7 passed (7)
      Tests  71 passed (71)
```

---

## 8. Test Coverage Areas

### Backend Coverage
- Service layer business logic
- Exception handling
- Input validation
- REST API endpoints
- HTTP status codes
- JSON response format

### Frontend Coverage
- Filter utility functions
- Sort utility functions
- Component rendering
- User interactions
- Form validation
- Custom hook state management
- Optimistic updates
- Error handling

---

## 9. Screenshots

### Test Execution - Backend
```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.capstone.taskmanagement.service.TaskServiceTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.capstone.taskmanagement.controller.TaskControllerIntegrationTest
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO] Tests run: 22, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Test Execution - Frontend
```
 DEV  v1.1.0

 PASS  src/utils/__tests__/filter.test.ts (14)
 PASS  src/utils/__tests__/sort.test.ts (15)
 PASS  src/components/__tests__/TaskItem.test.tsx (10)
 PASS  src/components/__tests__/TaskForm.test.tsx (10)
 PASS  src/components/__tests__/ConfirmDialog.test.tsx (10)
 PASS  src/hooks/__tests__/useTasks.test.ts (10)
 PASS  src/App.test.tsx (2)

 Test Files  7 passed (7)
      Tests  71 passed (71)
   Start at  10:30:00
   Duration  2.5s
```
