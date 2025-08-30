# Expense Tracker Backend

A robust backend API for Personal Finance Tracker application built with Node.js, Express.js, and PostgreSQL (Supabase).

## 🏗️ Architecture

This backend follows a **Repository-Service-Controller** layered architecture:

- **Controller Layer**: Handles HTTP requests/responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Manages database operations
- **Database**: PostgreSQL (Supabase) + Redis for caching

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database (Supabase)
- Redis server

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=your_supabase_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── config/          # Database, Redis, Swagger configs
├── middleware/      # Auth, RBAC, Rate limiting, Error handling
├── models/          # Database models (to be implemented)
├── repositories/    # Database access layer
├── services/        # Business logic layer
├── controllers/     # Request/response handlers
├── routes/          # API route definitions
├── utils/           # Logger, Response formatter
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/api/health`

## 🔄 Development Workflow

1. **Part 1**: ✅ Project setup & structure (Current)
2. **Part 2**: Database schema & migrations
3. **Part 3**: User model & repository
4. **Part 4**: Authentication system
5. **Part 5**: Middleware & RBAC
6. **Part 6**: Rate limiting
7. **Part 7**: Transactions CRUD
8. **Part 8**: Categories with caching
9. **Part 9**: Analytics & reporting
10. **Part 10**: Error handling & responses
11. **Part 11**: Swagger documentation
12. **Part 12**: Security hardening
13. **Part 13**: Admin user management
14. **Part 14**: Testing suite
15. **Part 15**: Production optimization

## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation
- SQL injection prevention

## 📊 Database

- **Primary**: PostgreSQL (Supabase)
- **Cache**: Redis
- **Migrations**: SQL scripts (to be implemented)

## 🤝 Contributing

1. Follow the layered architecture pattern
2. Write tests for new features
3. Update API documentation
4. Follow ESLint configuration

## 📄 License

MIT License
