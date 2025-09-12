# Multi-User Task Management REST API

A RESTful API built with Node.js, Express.js, and MySQL that allows multiple users to register, authenticate, and manage their personal tasks independently.

## Features

- **User Management**: Registration and JWT-based authentication
- **Task Management**: Full CRUD operations with user ownership
- **Security**: Password hashing, JWT tokens, user isolation
- **Validation**: Input validation and proper HTTP status codes
- **Pagination**: Efficient task listing with pagination
- **Search & Filter**: Search tasks by title/description and filter by status
- **Profile Management**: Update user profile information

## Setup Instructions

### Installation

1. **Clone the repository**

2. **Install dependencies**

3. **Database Setup**

4. **Configure Database**
Update `knexfile.js` with your MySQL credentials:

5. **Run Migrations**
npx knex migrate:latest

6. **Start the Server**
Development
npm run dev

Production
npm start


The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User
