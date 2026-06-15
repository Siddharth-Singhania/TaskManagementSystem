# Task Management API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Endpoints

### 1. Create Task

Creates a new task with the provided details.

**Endpoint:** `POST /tasks`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the capstone project",
  "priority": "HIGH",
  "dueDate": "2024-06-30"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Task title (1-255 characters) |
| description | string | No | Task description (max 2000 characters) |
| priority | string | No | LOW, MEDIUM, HIGH (default: MEDIUM) |
| dueDate | string | No | Due date in ISO format (YYYY-MM-DD) |

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the capstone project",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-06-30",
  "createdAt": "2024-06-15T10:30:00",
  "updatedAt": "2024-06-15T10:30:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "fieldErrors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

### 2. Get All Tasks

Retrieves all tasks (non-paginated).

**Endpoint:** `GET /tasks`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2024-06-30",
    "createdAt": "2024-06-15T10:30:00",
    "updatedAt": "2024-06-15T10:30:00"
  },
  {
    "id": 2,
    "title": "Write unit tests",
    "description": null,
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "dueDate": null,
    "createdAt": "2024-06-14T09:00:00",
    "updatedAt": "2024-06-15T11:00:00"
  }
]
```

---

### 3. Get Tasks (Paginated)

Retrieves tasks with pagination, filtering, and sorting.

**Endpoint:** `GET /tasks/paginated`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 0 | Page number (0-based) |
| size | integer | 10 | Page size (max 100) |
| status | string | null | Filter by status (TODO, IN_PROGRESS, DONE) |
| priority | string | null | Filter by priority (LOW, MEDIUM, HIGH) |
| sortBy | string | createdAt | Sort field (createdAt, dueDate, priority, status) |
| sortDir | string | desc | Sort direction (asc, desc) |

**Example Request:**
```
GET /tasks/paginated?page=0&size=10&status=TODO&sortBy=dueDate&sortDir=asc
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2024-06-30",
      "createdAt": "2024-06-15T10:30:00",
      "updatedAt": "2024-06-15T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

### 4. Get Task by ID

Retrieves a specific task by its ID.

**Endpoint:** `GET /tasks/{id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Task ID |

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-06-30",
  "createdAt": "2024-06-15T10:30:00",
  "updatedAt": "2024-06-15T10:30:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found",
  "message": "Task not found with id: 999"
}
```

---

### 5. Update Task

Updates an existing task.

**Endpoint:** `PUT /tasks/{id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Task ID |

**Request Body:**
```json
{
  "title": "Complete project documentation (Updated)",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-07-01"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Task title (1-255 characters) |
| description | string | No | Task description |
| status | string | No | TODO, IN_PROGRESS, DONE |
| priority | string | No | LOW, MEDIUM, HIGH |
| dueDate | string | No | Due date in ISO format |

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation (Updated)",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-07-01",
  "createdAt": "2024-06-15T10:30:00",
  "updatedAt": "2024-06-15T14:00:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found",
  "message": "Task not found with id: 999"
}
```

---

### 6. Delete Task

Deletes a task by its ID.

**Endpoint:** `DELETE /tasks/{id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Task ID |

**Response (204 No Content):**
No response body.

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found",
  "message": "Task not found with id: 999"
}
```

---

## Data Models

### Task
```json
{
  "id": "long",
  "title": "string",
  "description": "string | null",
  "status": "TODO | IN_PROGRESS | DONE",
  "priority": "LOW | MEDIUM | HIGH",
  "dueDate": "string (YYYY-MM-DD) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Error Response
```json
{
  "error": "string",
  "message": "string | null",
  "fieldErrors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### Paged Response
```json
{
  "content": "array",
  "page": "integer",
  "size": "integer",
  "totalElements": "long",
  "totalPages": "integer",
  "first": "boolean",
  "last": "boolean"
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Successful GET or PUT request |
| 201 | Created - Successful POST request |
| 204 | No Content - Successful DELETE request |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Interactive Documentation

When the backend server is running, you can access the interactive Swagger UI at:

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs
- **OpenAPI YAML:** http://localhost:8080/v3/api-docs.yaml

The Swagger UI allows you to:
- Browse all available endpoints
- View request/response schemas
- Test API endpoints directly from the browser
