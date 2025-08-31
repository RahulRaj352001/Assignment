# Expense Tracker Backend

A robust backend API for Personal Finance Tracker application built with Node.js, Express.js, and PostgreSQL (Supabase).

## Architecture

This backend follows a **Repository-Service-Controller** layered architecture:

- **Controller Layer**: Handles HTTP requests/responses and input validation
- **Service Layer**: Contains business logic and orchestrates operations
- **Repository Layer**: Manages database operations and data access
- **Database**: PostgreSQL (Supabase) + Redis for caching
- **Middleware**: Authentication, RBAC, rate limiting, and error handling

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Complete CRUD operations for users
- **Transaction Management**: Track income and expenses with categories
- **Category Management**: Organize transactions by categories
- **Analytics**: Financial insights and reporting
- **Security**: Helmet, XSS protection, rate limiting, CORS
- **Caching**: Redis integration for improved performance
- **API Documentation**: Swagger/OpenAPI specification
- **Testing**: Comprehensive test suite with Jest

## Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis
- **Authentication**: JWT
- **Validation**: Express-validator
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Documentation**: Swagger

## Project Structure

```
src/
├── config/          # Database, Redis, Swagger configurations
├── controllers/     # Request/response handlers
├── middleware/      # Auth, RBAC, rate limiting, error handling
├── models/          # Database models and schemas
├── repositories/    # Database access layer
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Logger, response formatter, helpers
├── app.js           # Express application setup
└── server.js        # Server entry point

tests/               # Test files
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database (Supabase)
- Redis server

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=your_supabase_postgres_connection_string
   JWT_SECRET=your_jwt_secret_key
   REDIS_URL=redis://localhost:6379
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Transactions

- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Analytics

- `GET /api/analytics/summary` - Financial summary
- `GET /api/analytics/trends` - Spending trends
- `GET /api/analytics/categories` - Category breakdown

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Code Quality

- ESLint configuration for code standards
- Pre-commit hooks for code quality
- Consistent code formatting

## Security Features

- **Authentication**: JWT-based token system
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Request validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet for secure HTTP headers
- **XSS Protection**: Cross-site scripting prevention
- **CORS**: Configurable cross-origin resource sharing
- **SQL Injection**: Parameterized queries and validation

## Database

- **Primary Database**: PostgreSQL (Supabase)
- **Caching Layer**: Redis for session and data caching

## API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/api/health`

## Environment Variables

| Variable       | Description                  | Default                |
| -------------- | ---------------------------- | ---------------------- |
| `PORT`         | Server port                  | 5000                   |
| `NODE_ENV`     | Environment mode             | development            |
| `DATABASE_URL` | PostgreSQL connection string | -                      |
| `JWT_SECRET`   | JWT signing secret           | -                      |
| `REDIS_URL`    | Redis connection string      | redis://localhost:6379 |

## Contributing

1. Follow the established layered architecture pattern
2. Write tests for new features and maintain test coverage
3. Update API documentation for new endpoints
4. Follow ESLint configuration and coding standards
5. Ensure proper error handling and validation

## License

MIT License
