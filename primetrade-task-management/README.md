# ⚡ Primetrade Task Manager

A **Secure Task Management System** with JWT Authentication and Role-Based Access Control (RBAC), built as part of the Primetrade.ai Backend Developer Internship assignment.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.2, Spring Security |
| Auth | JWT (jjwt 0.12.5), BCrypt password hashing |
| Database | MySQL 8 / TiDB |
| ORM | Spring Data JPA / Hibernate |
| API Docs | Swagger / OpenAPI 3 (springdoc) |
| Frontend | React 18, Vite, React Router v6, Axios |
| Deployment | Backend → Render, Frontend → Vercel, DB → Railway/TiDB |

---

## 🚀 Features

### Backend (Primary)
- ✅ User registration & login with **BCrypt password hashing**
- ✅ **JWT authentication** (stateless, secure)
- ✅ **Role-based access control** — `ROLE_USER` and `ROLE_ADMIN`
- ✅ Full **CRUD** for Tasks (title, description, status, priority)
- ✅ **API versioning** (`/api/v1/`)
- ✅ **Global exception handling** with structured error responses
- ✅ **Input validation** via Jakarta Bean Validation
- ✅ **Swagger UI** for API documentation
- ✅ Pagination support for task listing
- ✅ CORS configuration for frontend integration

### Frontend (Supportive)
- ✅ Register & Login pages with JWT token storage
- ✅ Protected Dashboard — visible only after login
- ✅ Task CRUD — Create, Edit, Delete with modal UI
- ✅ Admin Panel — view all users and all tasks
- ✅ Error & success messages from API responses
- ✅ Pagination for task list

---

## 📁 Project Structure

```
primetrade-task-management/
├── backend/
│   ├── src/main/java/com/primetrade/taskmanager/
│   │   ├── config/          # Security & Swagger config
│   │   ├── controller/      # AuthController, TaskController, AdminController
│   │   ├── dto/             # Request & Response DTOs
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── entity/          # User, Task (JPA entities)
│   │   ├── exception/       # GlobalExceptionHandler, custom exceptions
│   │   ├── repository/      # UserRepository, TaskRepository
│   │   ├── security/        # JWT utils, filter, entry point, UserDetails
│   │   └── service/         # AuthService, TaskService
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, TaskCard, TaskModal, ProtectedRoute
    │   ├── context/         # AuthContext (JWT state management)
    │   ├── pages/           # LoginPage, RegisterPage, DashboardPage, AdminPage
    │   ├── services/        # api.js (Axios + JWT interceptor)
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 21
- Maven 3.8+
- Node.js 18+
- MySQL 8 (or TiDB Cloud)

### Backend Setup

```bash
cd backend

# 1. Configure database in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/primetrade_db
spring.datasource.username=root
spring.datasource.password=your_password

# 2. Build and run
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`
Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |

### Tasks (Protected — JWT required)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/tasks` | USER, ADMIN | Create a task |
| GET | `/api/v1/tasks/my` | USER, ADMIN | Get own tasks (paginated) |
| GET | `/api/v1/tasks/all` | ADMIN only | Get all tasks |
| GET | `/api/v1/tasks/{id}` | USER (own), ADMIN | Get task by ID |
| PUT | `/api/v1/tasks/{id}` | USER (own), ADMIN | Update a task |
| DELETE | `/api/v1/tasks/{id}` | USER (own), ADMIN | Delete a task |

### Admin (ADMIN only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List all users |
| GET | `/api/v1/admin/stats` | Dashboard statistics |

### Sample Request — Register
```json
POST /api/v1/auth/register
{
  "username": "jayadip",
  "email": "jayadip@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Sample Request — Login
```json
POST /api/v1/auth/login
{
  "username": "jayadip",
  "password": "password123"
}
```
Response includes `token` — use as `Authorization: Bearer <token>` for all protected endpoints.

### Sample Request — Create Task
```json
POST /api/v1/tasks
Authorization: Bearer <token>
{
  "title": "Implement JWT Auth",
  "description": "Add JWT-based security to the API",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

---

## 🗄️ Database Schema

```sql
-- users table
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ROLE_USER', 'ROLE_ADMIN') NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at DATETIME NOT NULL
);

-- tasks table
CREATE TABLE tasks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
  priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
  user_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔒 Security Architecture

1. **BCrypt hashing** — all passwords are hashed with BCrypt strength 10
2. **JWT tokens** — stateless authentication, no server-side sessions
3. **Role-based method security** — `@PreAuthorize` annotations on endpoints
4. **Input sanitization** — Bean Validation on all request DTOs
5. **Global exception handling** — consistent error responses, no stack traces exposed
6. **CORS** — configured to allow frontend origin only

---

## 📈 Scalability Note

This project follows a **modular layered architecture** (Controller → Service → Repository) that supports straightforward migration to a **microservices** model:

- **JWT authentication** enables **stateless horizontal scaling** — multiple backend instances share no session state
- **Database indexing** on `username`, `email`, and `user_id` (FK) supports high-read performance
- **DTO pattern** decouples API contracts from internal entities, enabling versioning without breaking changes
- **API versioning** (`/v1/`) allows new API versions alongside existing ones
- **Pagination** on all list endpoints prevents memory overload at scale
- Future additions: **Redis caching** for frequently read tasks, **message queues** (RabbitMQ/Kafka) for async operations, **Docker + Kubernetes** for container orchestration

---

## 🌐 Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Backend | Render (Free tier) | Set env vars for DB credentials and JWT secret |
| Frontend | Vercel | Set `VITE_API_BASE_URL` to your Render backend URL |
| Database | Railway / TiDB Cloud | Free tier MySQL-compatible |

### Environment Variables for Deployment

```properties
# Backend (Render)
SPRING_DATASOURCE_URL=jdbc:mysql://<host>/<db>
SPRING_DATASOURCE_USERNAME=<user>
SPRING_DATASOURCE_PASSWORD=<pass>
APP_JWT_SECRET=<your-256-bit-secret>
APP_JWT_EXPIRATION_MS=86400000
```

---

## 👨‍💻 Author

**Jayadip Deshmukh**  
Full Stack Developer | Java · Spring Boot · React · MySQL  
GitHub: [github.com/jayadipdeshmukh](https://github.com/jayadipdeshmukh)

---

*Built for Primetrade.ai Backend Developer Internship — Round 0 Assignment*
