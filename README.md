#  BookmarkHub Backend

![NestJS](https://img.shields.io/badge/NestJS-v10-red.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)
![TypeORM](https://img.shields.io/badge/TypeORM-ORM-orange.svg)
![JWT](https://img.shields.io/badge/Auth-JWT-green.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern **NestJS + TypeORM + PostgreSQL** backend API for managing bookmarks with authentication, voting, and detailed logging.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Overview](#-api-overview)
  - [Auth Endpoints](#-auth-endpoints)
  - [Bookmarks Endpoints](#-bookmarks-endpoints)
  - [Voting Endpoints](#-voting-endpoints)
- [Logging & Error Handling](#-logging--error-handling)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

✅ **User Authentication**
- Register, login, JWT-based authentication  
- Passwords hashed with bcrypt  
- Validation for email and strong passwords  

✅ **Bookmarks**
- Create, list, and view bookmarks  
- Public GET endpoint (accessible without login)  
- Shows total votes and user-specific vote when logged in  

✅ **Voting**
- Upvote / Downvote support  
- Automatically removes or toggles existing votes  
- Separate logs for each voting action  

✅ **Logging**
- Unified logging for all modules  
- Logs every request, action, and error  

✅ **TypeORM + PostgreSQL**
- Entities for User, Bookmark, and Vote  
- Uses TypeORM repositories and relations  
- Configurable via `.env`  

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Backend Framework | [NestJS](https://nestjs.com) |
| Database ORM | [TypeORM](https://typeorm.io) |
| Database | PostgreSQL |
| Authentication | JWT (via `@nestjs/jwt`, `passport-jwt`) |
| Validation | class-validator, class-transformer |
| Logging | NestJS Logger |
| HTTP Framework | Fastify (adapter for better performance) |

---

## 📁 Folder Structure

backend/
├── src/
│ ├── auth/ # Authentication module
│ │ ├── auth.controller.ts # Handles /auth routes (register, login)
│ │ ├── auth.service.ts # Business logic for authentication
│ │ ├── auth.module.ts # Imports JWT, Users module
│ │ ├── jwt.strategy.ts # JWT validation and payload extraction
│ │ └── dto/ # DTOs for register/login validation
│ │
│ ├── bookmarks/ # Bookmarks module
│ │ ├── bookmarks.controller.ts # Routes for CRUD & listing
│ │ ├── bookmarks.service.ts # Handles DB operations & vote aggregation
│ │ ├── bookmark.entity.ts # TypeORM entity for bookmarks
│ │ └── bookmarks.module.ts
│ │
│ ├── votes/ # Voting module
│ │ ├── votes.controller.ts # Endpoint to handle voting
│ │ ├── votes.service.ts # Core logic for upvotes/downvotes
│ │ ├── vote.entity.ts # TypeORM entity for votes
│ │ └── votes.module.ts
│ │
│ ├── users/ # Users module
│ │ ├── users.service.ts # Handles user DB operations
│ │ ├── user.entity.ts # TypeORM entity for users
│ │ └── users.module.ts
│ │
│ ├── common/ # Shared utilities and middlewares
│ │ ├── filters/ # Exception filters
│ │ │ └── all-exceptions.filter.ts
│ │ ├── guards/ # Custom guards
│ │ │ └── optional-jwt-auth.guard.ts
│ │ ├── interceptors/ # (Optional) Response interceptors
│ │ ├── decorators/ # Custom decorators if needed
│ │ └── utils/ # Common utility functions
│ │
│ ├── app.module.ts # Root application module
│ ├── main.ts # Application entry point
│ └── config/ # (Optional) Config setup for env and DB
│
├── .env # Environment configuration file
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/bookmarkhub.git
cd bookmarkhub/backend
```

### 2️⃣ Install Dependencies

Make sure Node.js ≥ 18 and npm ≥ 8 are installed.

```bash
npm install
```

Install Nest CLI globally (optional):

```bash
npm install -g @nestjs/cli
```

### 3️⃣ Setup PostgreSQL - Locally or on Docker
Local PostgreSQL
```bash
CREATE DATABASE bookmarkhub;
```

Docker
```bash
docker run --name bookmarkhub-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bookmarkhub -p 5432:5432 -d postgres
```

## Environment Variables

Create a .env file in the backend folder:
```bash
# --- Application ---
PORT=3000

# --- Database ---
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=bookmarkhub

# --- JWT ---
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d  

# --- Logging ---
LOG_LEVEL=debug
```

## Running the Project
```bash
npm run start:dev
```

API available at:
 http://localhost:3000

## Auth Endpoints
POST /auth/register

Registers a new user.

Request Body

```bash
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Response

```bash
{
  "message": "User registered successfully"
}
```

POST /auth/login

Logs in and returns JWT.

Request Body
```bash

{
  "email": "user@example.com",
  "password": "Password123"
}
```

Response
```bash

{
  "access_token": "your.jwt.token"
}
```

## Bookmarks Endpoints
POST /bookmarks (Authenticated)

Headers

Authorization: Bearer <token>


Body
```bash

{
  "title": "NestJS Docs",
  "url": "https://docs.nestjs.com"
}
```

Response
```bash

{
  "message": "Bookmark created successfully"
}
```

GET /bookmarks

Public endpoint — view all bookmarks.

Response (Anonymous):
```bash

[
  {
    "id": 1,
    "title": "NestJS Docs",
    "url": "https://docs.nestjs.com",
    "vote_count": 5
  }
]
```

Response (Authenticated):
```bash

[
  {
    "id": 1,
    "title": "NestJS Docs",
    "url": "https://docs.nestjs.com",
    "vote_count": 5,
    "user_vote": 1
  }
]
```

## Voting Endpoints
POST /votes

Body
```bash

{
  "bookmarkId": 1,
  "value": 1
}
```

value =

1 → Upvote

-1 → Downvote

Response Examples

{ "message": "Upvote added" }
{ "message": "Downvote removed" }
{ "message": "Changed to upvote" }

## Logging & Error Handling

Every request and response is logged with timestamp and user context.

AllExceptionsFilter ensures consistent error response format.

Example log:

[Nest] 4120  - 30/10/2025, 10:35:42 PM  LOG [BookmarksController] get bookmarks request received
[Nest] 4120  - 30/10/2025, 10:35:42 PM  LOG [BookmarksService] Returned 12 bookmarks
[Nest] 4120  - 30/10/2025, 10:35:45 PM WARN [VotesService] Invalid vote value: 2

## Testing

Run unit tests:

npm run test


Run end-to-end (E2E) tests:

npm run test:e2e

## Troubleshooting
Problem	Possible Fix
Error: secretOrPrivateKey must have a value	Check that JWT_SECRET is defined in .env.
Database connection refused	Ensure PostgreSQL is running and credentials match .env.
Vote not updating	Confirm foreign key relationships in entities are correct.
500 Internal Server Error	Check logs — likely an unhandled exception caught by AllExceptionsFilter.
