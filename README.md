# Task Management Application

A full-stack task management application built as a capstone project demonstrating modern web development practices.

## Technology Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **CSS3** for styling

### Backend
- **Java 17** with **Spring Boot 3.2.5**
- **Spring Data JPA** for data persistence
- **SpringDoc OpenAPI** for API documentation

### Database
- **PostgreSQL** for production
- **H2** for testing

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 14** or higher
- **Maven 3.8** or higher

## Quick Start

### 1. Database Setup
```sql
CREATE DATABASE taskmanagement;
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/tasks | Get all tasks |
| GET | /api/v1/tasks/paginated | Get tasks with pagination |
| GET | /api/v1/tasks/{id} | Get task by ID |
| POST | /api/v1/tasks | Create new task |
| PUT | /api/v1/tasks/{id} | Update task |
| DELETE | /api/v1/tasks/{id} | Delete task |

## Features

### Core Features
- Create, read, update, and delete tasks
- Task status management (To Do, In Progress, Done)
- Priority levels (Low, Medium, High)
- Due date tracking

### Advanced Features
- Filter tasks by status and priority
- Sort tasks by multiple criteria
- Pagination support for large datasets
- Keyboard shortcuts for power users
- Persistent filters across sessions
- Loading skeleton animations
- Responsive design (mobile, tablet, desktop)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| N | Create new task |
| R | Refresh task list |
| Esc | Clear all filters |
| ? | Show keyboard shortcuts |

## Running Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## Documentation

- **[Project Documentation](docs/PROJECT_DOCUMENTATION.md)** - Problem statement, solution overview, architecture, features
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Detailed API endpoints and examples
- **[Testing Evidence](docs/TESTING_EVIDENCE.md)** - Test cases, results, and coverage

### Interactive API Docs
When backend is running:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Project Structure

```
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source files
│   │   └── com/capstone/taskmanagement/
│   │       ├── controller/    # REST controllers
│   │       ├── service/       # Business logic
│   │       ├── repository/    # Data access
│   │       ├── model/         # JPA entities
│   │       ├── dto/           # Data transfer objects
│   │       ├── exception/     # Exception handling
│   │       └── config/        # Configuration
│   ├── src/test/java/         # Test files
│   └── pom.xml                # Maven configuration
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── api/               # API client
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript types
│   ├── package.json           # npm configuration
│   └── vite.config.ts         # Vite configuration
│
├── docs/                       # Documentation
│   ├── PROJECT_DOCUMENTATION.md
│   ├── API_DOCUMENTATION.md
│   └── TESTING_EVIDENCE.md
│
└── README.md
```

## Team Members

| Member | Role | Responsibilities |
|--------|------|------------------|
| UDAY KIRAN | Backend Lead | Spring Boot setup, Database schema, Service layer |
| ATHARV SURVE | Frontend Lead | React setup, UI Components, Styling |
| ANTONY ALAN | Full Stack | REST API, API Client, Integration |
| ABHIJEET ALANDE | QA Engineer | Unit tests, Integration tests, Testing |
| SIDDHARTH SINGHANIA | Git & Docs | Documentation, Git setup, Code review |

## License

This project is part of a capstone project for educational purposes.
