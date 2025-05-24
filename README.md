# CRUD API

A simple CRUD (Create, Read, Update, Delete) API using an in-memory database, built with Node.js and TypeScript.

## Overview

This project implements a RESTful API that allows you to perform CRUD operations on user data. It uses an in-memory database to store the information during runtime. The application can be run in multiple modes, including development, production, and multi-instance modes with load balancing.

## Features

- **RESTful API**: Complete implementation of CRUD operations
- **In-memory Database**: Fast data access without external database dependencies
- **TypeScript**: Type-safe code implementation
- **Input Validation**: Request validation for proper data formatting
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Horizontal Scaling**: Load balancing across multiple instances using Node.js Cluster API
- **Environment Configuration**: Environment-specific settings using dotenv

## API Endpoints

The following endpoints are available:

### Users API

- **GET** `/api/users` - Get all users
- **GET** `/api/users/{userId}` - Get a specific user by ID
- **POST** `/api/users` - Create a new user
- **PUT** `/api/users/{userId}` - Update an existing user
- **DELETE** `/api/users/{userId}` - Delete a user

## User Entity

```typescript
{
  id: string;       // UUID v4, generated on server side
  username: string; // Required
  age: number;      // Required
  hobbies: string[]; // Required (can be empty array)
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/5tronciy/crud-api.git
cd crud-api
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory with the following content:
```
PORT=4000
```

## Running the Application

### Development Mode

Run the application with hot-reload for development:

```bash
npm run start:dev
```

### Production Mode

Build and run the application in production mode:

```bash
npm run start:prod
```

### Multi-instance Mode with Load Balancing

Run multiple instances of the application with load balancing:

```bash
npm run start:multi
```

In multi-instance mode:
- The load balancer runs on the main port (default: 4000)
- Worker instances run on subsequent ports (4001, 4002, etc.)
- Requests are distributed using Round-robin algorithm
- In-memory database state is synchronized across all instances

## Testing

Run tests using Jest:

```bash
npm test
```

## Implementation Details

### Technologies

- **Node.js**: JavaScript runtime (v22.x.x)
- **TypeScript**: Static typing for JavaScript
- **UUID**: For generating unique identifiers
- **Jest**: For testing
- **Webpack**: For bundling in production mode
- **ts-node-dev**: For development with hot-reload
- **dotenv**: For environment variable management
- **cross-env**: For cross-platform environment variable setting

## Response Status Codes

- **200 (OK)**: Request succeeded
- **201 (Created)**: Resource successfully created
- **204 (No Content)**: Request succeeded but no content to return
- **400 (Bad Request)**: Invalid input or parameters
- **404 (Not Found)**: Resource not found
- **500 (Internal Server Error)**: Server-side error

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Roman Golchuk
- Website: [https://www.roman-golchuk.site/](https://www.roman-golchuk.site/)
- GitHub: [https://github.com/5tronciy](https://github.com/5tronciy)