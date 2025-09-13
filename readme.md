A robust REST API built with **Node.js**, **Express.js**, and **MySQL** that allows multiple users to register, authenticate, and manage their personal tasks independently. Each user has complete isolation of their task data with comprehensive validation and security features.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with email uniqueness validation
- **JWT-based Authentication** with token expiration
- **Password Security** with bcrypt hashing (minimum 6 characters)
- **User Profile Management** with email and name updates

### 📝 Task Management
- **Complete CRUD Operations** for tasks
- **User Ownership Isolation** - users can only access their own tasks
- **Task Status Management** with predefined states (pending, in_progress, done)
- **Unique Title Validation** per user to prevent duplicates
- **Rich Task Data** with title, description, and status

### 🔍 Advanced Features
- **Pagination** for task listing with customizable page size
- **Search & Filtering** by task status
- **Request Logging** with unique request IDs
- **Comprehensive Validation** using Joi schema validation
- **Global Error Handling** with consistent error responses
- **Health Check Endpoint** for monitoring

### 🛡️ Security & Best Practices
- **Input Validation & Sanitization** on all endpoints
- **SQL Injection Prevention** through parameterized queries
- **CORS Configuration** for cross-origin requests
- **Environment-based Configuration** for different deployment stages

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **MySQL** (v5.7 or higher)
- **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamakashyadav/task-management-api.git
   cd task-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=task_management

   # JWT Secret (use a strong secret in production)
   JWT_SECRET=your_super_secret_jwt_key_change_in_production

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create the database
   mysql -u root -p -e "CREATE DATABASE task_management;"
   
   # Run migrations
   npx knex migrate:latest
   ```

5. **Start the Application**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` after successful database connection.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('pending', 'in_progress', 'done') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_title (user_id, title)
);
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
All task endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 👥 User Management

### Register User
**POST** `/users/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-09-13T07:30:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: 3-50 characters, required
- `email`: Valid email format, unique, required
- `password`: Minimum 6 characters, required

---

### Login User
**POST** `/users/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

---

### Update Profile
**PUT** `/users/profile`
🔒 *Requires Authentication*

Update user profile information.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "updated_at": "2025-09-13T08:15:00.000Z"
  }
}
```

---

## 📋 Task Management

### Create Task
**POST** `/tasks`
🔒 *Requires Authentication*

Create a new task for the authenticated user.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Complete API Documentation",
  "description": "Write comprehensive API documentation with examples",
  "status": "pending"
}
```

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Complete API Documentation",
    "description": "Write comprehensive API documentation with examples",
    "status": "pending",
    "created_at": "2025-09-13T07:45:00.000Z",
    "updated_at": "2025-09-13T07:45:00.000Z"
  }
}
```

**Validation Rules:**
- `title`: 3-100 characters, required, unique per user
- `description`: Maximum 1000 characters, optional
- `status`: Must be one of: `pending`, `in_progress`, `done`

---

### Get All Tasks
**GET** `/tasks?page=1&limit=10&status=pending`
🔒 *Requires Authentication*

Retrieve paginated list of user's tasks with optional filtering.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page (1-100), default: 10
- `status` (optional): Filter by status (`pending`, `in_progress`, `done`)

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete API Documentation",
      "description": "Write comprehensive API documentation with examples",
      "status": "pending",
      "created_at": "2025-09-13T07:45:00.000Z",
      "updated_at": "2025-09-13T07:45:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Setup Database",
      "description": "Configure MySQL database for production",
      "status": "in_progress",
      "created_at": "2025-09-13T08:00:00.000Z",
      "updated_at": "2025-09-13T08:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Task by ID
**GET** `/tasks/:id`
🔒 *Requires Authentication*

Retrieve a specific task by ID (only if it belongs to the authenticated user).

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Complete API Documentation",
    "description": "Write comprehensive API documentation with examples",
    "status": "pending",
    "created_at": "2025-09-13T07:45:00.000Z",
    "updated_at": "2025-09-13T07:45:00.000Z"
  }
}
```

---

### Update Task
**PUT** `/tasks/:id`
🔒 *Requires Authentication*

Update an existing task (only if it belongs to the authenticated user).

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Complete API Documentation - Updated",
  "description": "Write comprehensive API documentation with examples and testing guide",
  "status": "in_progress"
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Complete API Documentation - Updated",
    "description": "Write comprehensive API documentation with examples and testing guide",
    "status": "in_progress",
    "created_at": "2025-09-13T07:45:00.000Z",
    "updated_at": "2025-09-13T09:15:00.000Z"
  }
}
```

---

### Delete Task
**DELETE** `/tasks/:id`
🔒 *Requires Authentication*

Delete a task (only if it belongs to the authenticated user).

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (204 No Content):**
```
(Empty response body)
```

---

## 🏥 System Endpoints

### Health Check
**GET** `/health`

Check API health and server status.

**Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-09-13T07:30:00.000Z",
  "uptime": 3600.45,
  "environment": "Development"
}
```

---

## ❌ Error Responses

### Error Response Format
```json
{
  "error": "Error description",
  "type": "ErrorType",
  "timestamp": "2025-09-13T07:30:00.000Z"
}
```

### HTTP Status Codes
- **200** - OK (Success)
- **201** - Created (Resource created successfully)
- **204** - No Content (Success with no response body)
- **400** - Bad Request (Validation error)
- **401** - Unauthorized (Authentication required/failed)
- **404** - Not Found (Resource not found)
- **409** - Conflict (Duplicate resource)
- **500** - Internal Server Error (Server error)

### Common Error Examples

**Validation Error (400):**
```json
{
  "error": "title must be at least 3 characters",
  "type": "ValidationError",
  "timestamp": "2025-09-13T07:30:00.000Z"
}
```

**Authentication Error (401):**
```json
{
  "error": "Authorization token missing",
  "type": "AuthenticationError",
  "timestamp": "2025-09-13T07:30:00.000Z"
}
```

**Conflict Error (409):**
```json
{
  "error": "Email already registered",
  "type": "ConflictError",
  "timestamp": "2025-09-13T07:30:00.000Z"
}
```

---

## 🧪 Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create a task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "status": "pending"
  }'
```

**Get all tasks:**
```bash
curl -X GET "http://localhost:3000/tasks?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: `<your_jwt_token_after_login>`
3. Use `{{base_url}}` and `{{jwt_token}}` in your requests

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run database migrations
npm run migrate

# Create a new migration
npx knex migrate:make migration_name
```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_PORT` | MySQL port | `3306` | Yes |
| `DB_USER` | MySQL username | - | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment | `development` | No |

### Project Structure

```
task-management-api/
├── src/
│   ├── controllers/          # Request handlers
│   ├── routes/              # API routes
│   ├── middlewares/         # Custom middleware
│   ├── validations/         # Joi validation schemas
│   ├── utils/               # Utility functions
│   └── migrations/           # Database migrations
│   ├── constants.js         # Application constants
│   ├── helper.js           # Helper functions
│   └── server.js           # Main application file
├── .env                    # Environment variables
├── knexfile.js            # Knex configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

---