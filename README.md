# CRUD NextJS + NestJS

A full-stack application demonstrating a modern web architecture with Next.js for the frontend and NestJS for the backend. The project implements a product management system with AI-powered product descriptions.

## Project Overview

- **Frontend**: Next.js application with modern UI components and real-time updates
- **Backend**: NestJS REST API with clean architecture principles
- **Features**:
  - Product CRUD operations
  - AI-powered product description generation
  - Caching with Redis
  - Database persistence with Prisma
  - Real-time updates
  - Responsive design

## Getting Started

### Prerequisites

- Node.js 16+
- Redis server
- PostgreSQL database
- Yarn or npm
- Docker

### Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/felpsalvs/crud-nextjs-nestjs.git
cd crud-nextjs-nestjs
```

2. Backend Setup:
```bash
cd backend
cp .env.example .env  # Configure your environment variables
npm install
docker compose up -d
npx prisma migrate dev --name init
npm run start:dev
```

3. Frontend Setup:
```bash
cd frontend
cp .env.example .env  # Configure your environment variables
npm install
npm run dev
```

4. Access the application at `http://localhost:3000`

## Key Dependencies

### Frontend
- **Next.js**: React framework for production-grade applications
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **SWR**: React Hooks for data fetching with caching and real-time updates
- **Clerk**: Authentication and user management
- **Shadcn/ui**: Pre-built accessible UI components

### Backend
- **NestJS**: Progressive Node.js framework for scalable server-side applications
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **Redis**: In-memory data store for caching
- **Google Gemini AI**: AI service for generating product descriptions
- **Class Validator**: Runtime type checking and validation

## Technical Decisions

1. **Clean Architecture**
   - Separation of concerns with domain-driven design
   - Clear dependency injection for better testability
   - Repository pattern for data access abstraction

2. **Performance Optimizations**
   - Redis caching for frequently accessed data
   - SWR for client-side caching and real-time updates
   - Server-side rendering where appropriate

3. **Developer Experience**
   - TypeScript for type safety
   - ESLint and Prettier for code consistency
   - Environment-based configuration

4. **Scalability Considerations**
   - Modular architecture for easy feature additions
   - Containerization-ready setup
   - Efficient database querying with Prisma