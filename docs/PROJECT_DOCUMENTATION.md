# Task Management Application - Project Documentation

## 1. Problem Statement

Managing tasks effectively is a fundamental challenge for individuals and teams. Without a centralized system, tasks get lost, priorities become unclear, and deadlines are missed. Many existing solutions are either too complex for simple needs or lack the flexibility to adapt to different workflows.

**Key Problems Addressed:**
- Lack of centralized task tracking
- Difficulty in prioritizing work
- No visibility into task progress
- Inability to filter and organize tasks efficiently
- Poor user experience on mobile devices

## 2. Solution Overview

The Task Management Application is a full-stack web application that enables users to create, organize, track, and manage tasks through an intuitive web interface. The solution provides:

- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Status Workflow**: Track tasks through To Do → In Progress → Done stages
- **Priority Management**: Categorize tasks by Low, Medium, or High priority
- **Filtering & Sorting**: Quickly find tasks using various criteria
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Power user features for efficient task management
- **Persistent Settings**: Filter preferences saved across sessions

## 3. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Component Library |
| TypeScript | 5.2.2 | Type-safe JavaScript |
| Vite | 5.0.8 | Build Tool & Dev Server |
| Vitest | 1.1.0 | Unit Testing Framework |
| React Testing Library | 14.1.2 | Component Testing |
| CSS3 | - | Styling & Responsive Design |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Programming Language |
| Spring Boot | 3.2.5 | Application Framework |
| Spring Data JPA | 3.2.5 | Data Persistence |
| Spring Validation | 3.2.5 | Input Validation |
| SpringDoc OpenAPI | 2.3.0 | API Documentation |
| JUnit 5 | 5.10.2 | Unit Testing |
| Mockito | 5.11.0 | Mocking Framework |
| H2 Database | 2.2.224 | Testing Database |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 14+ | Production Database |
| H2 | 2.2.224 | Test Database |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| Git | Version Control |
| GitHub | Repository Hosting |
| Maven | Build Automation |
| npm | Package Management |

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 React Frontend (Port 3000)               │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │TaskList  │ │TaskForm  │ │FilterBar │ │SortCtrl  │   │    │
│  │  │Page      │ │          │ │          │ │          │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │              Custom Hooks (useTasks)             │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │              API Client (Fetch)                  │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Spring Boot Backend (Port 8080)             │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │           Controller Layer (REST API)            │   │    │
│  │  │  • TaskController                                │   │    │
│  │  │  • GlobalExceptionHandler                        │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │              Service Layer                       │   │    │
│  │  │  • TaskService (Business Logic)                  │   │    │
│  │  │  • Input Sanitization                            │   │    │
│  │  │  • Audit Logging                                 │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │            Repository Layer (JPA)                │   │    │
│  │  │  • TaskRepository                                │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 PostgreSQL Database                      │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │                  tasks table                      │   │    │
│  │  │  • id (PK)        • priority                     │   │    │
│  │  │  • title          • due_date                     │   │    │
│  │  │  • description    • created_at                   │   │    │
│  │  │  • status         • updated_at                   │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Feature List

### Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| Task Creation | Create tasks with title, description, priority, due date | Complete |
| Task Viewing | View all tasks in a list with key details | Complete |
| Task Editing | Update any task field | Complete |
| Task Deletion | Remove tasks with confirmation dialog | Complete |
| Status Management | Change status: To Do, In Progress, Done | Complete |

### Advanced Features
| Feature | Description | Status |
|---------|-------------|--------|
| Filtering | Filter by status and/or priority | Complete |
| Sorting | Sort by due date, priority, status, created date | Complete |
| Pagination | Server-side pagination for large datasets | Complete |
| Keyboard Shortcuts | N (new), R (refresh), Esc (clear), ? (help) | Complete |
| Persistent Settings | Filters/sort saved in localStorage | Complete |
| Loading Skeletons | Animated loading states | Complete |

### Technical Features
| Feature | Description | Status |
|---------|-------------|--------|
| REST API | RESTful endpoints with proper HTTP methods | Complete |
| Input Validation | Server-side validation with error messages | Complete |
| Input Sanitization | XSS prevention, HTML stripping | Complete |
| Audit Logging | All CRUD operations logged | Complete |
| API Documentation | Swagger/OpenAPI documentation | Complete |
| Responsive Design | Mobile, tablet, desktop layouts | Complete |
| Accessibility | ARIA labels, semantic HTML | Complete |
| Error Handling | Graceful error handling with user feedback | Complete |
| Optimistic Updates | Instant UI updates with rollback on error | Complete |

## 6. Team Member Responsibilities

| Team Member | Role | Responsibilities |
|-------------|------|------------------|
| Member 1 | Backend Lead | Spring Boot setup, Entity/Repository, Service layer, Business logic |
| Member 2 | Frontend Lead | React setup, UI Components, State management, Styling |
| Member 3 | Full Stack | REST Controller, API client, Integration, Error handling |
| Member 4 | QA Engineer | Unit tests, Integration tests, Component tests, Test documentation |
| Member 5 | DevOps & Docs | Project documentation, Git setup, API docs, Code review |

### Detailed Breakdown

**Member 1 - Backend Lead:**
- Spring Boot project initialization
- Database schema design
- JPA Entity and Repository implementation
- Service layer business logic
- Input sanitization and audit logging

**Member 2 - Frontend Lead:**
- React project setup with Vite
- TypeScript type definitions
- UI components (TaskItem, TaskForm, FilterBar, etc.)
- Custom hooks (useTasks, useLocalStorage, useDebounce)
- Responsive CSS styling

**Member 3 - Full Stack:**
- REST Controller implementation
- CORS configuration
- Frontend API client
- Error handling integration
- Keyboard shortcuts implementation

**Member 4 - QA Engineer:**
- Backend unit tests (JUnit, Mockito)
- Backend integration tests (MockMvc)
- Frontend component tests (React Testing Library)
- Frontend utility tests (Vitest)
- Test documentation and coverage reports

**Member 5 - DevOps & Documentation:**
- Project documentation (Problem statement, Architecture)
- API documentation (Swagger, Markdown)
- Testing evidence documentation
- README and setup guides
- Git repository setup and code review

## 7. Database Schema

```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_status CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    CONSTRAINT chk_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

## 8. Security Considerations

1. **Input Validation**: All inputs validated using Spring Validation annotations
2. **Input Sanitization**: HTML tags and null bytes stripped from user input
3. **SQL Injection Prevention**: JPA parameterized queries used throughout
4. **CORS Configuration**: Restricted to allowed origins
5. **Error Handling**: Internal details hidden from API responses

## 9. Future Enhancements

- User authentication and authorization
- Task categories/tags
- Task assignments (multi-user)
- Email notifications for due dates
- File attachments
- Task comments
- Recurring tasks
- Export to CSV/PDF
- Dark mode theme
