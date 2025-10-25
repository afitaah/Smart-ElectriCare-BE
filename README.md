# Smart ElectriCare System - Backend API

A Node.js, Express, and MongoDB backend API for the Smart ElectriCare System.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Customer Management**: CRUD operations for customer data
- **Billing System**: Bill generation and management
- **Payment Processing**: Payment tracking and processing
- **User Management**: User roles and permissions
- **Notifications**: Real-time notification system
- **Dashboard Analytics**: Comprehensive dashboard statistics
- **Status Management**: Centralized numeric status codes with string transformations

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** for REST API
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for HTTP request logging

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ses-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ses_database
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## Database Seeding

To populate the database with initial data, you can create a seed script:

```typescript
import { seedDatabase } from './src/utils/seedData';

// Run this once to seed the database
seedDatabase();
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/filter` - Get filtered customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill by ID
- `GET /api/bills/customer/:customerId` - Get bills by customer
- `POST /api/bills` - Create bill
- `PUT /api/bills/:id` - Update bill

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/customer/:customerId` - Get payments by customer
- `POST /api/payments` - Create payment

### Users
- `GET /api/users` - Get all users
- `GET /api/users/filter` - Get filtered users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `POST /api/notifications` - Create notification

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Status Codes System

The backend uses a centralized numeric status code system:

### Customer Status
- `1` - Pending
- `2` - Active  
- `3` - Suspended

### Connection Status
- `1` - Connected
- `2` - Lost
- `3` - Under Warning

### Billing Status
- `1` - Unbilled
- `2` - Billed

### Payment Status
- `1` - Unpaid
- `2` - Paid

### Bill Status
- `1` - Unpaid
- `2` - Paid
- `3` - Overdue

### Payment Process Status
- `1` - Pending
- `2` - Completed
- `3` - Failed

### User Role
- `1` - Viewer
- `2` - Operator
- `3` - Manager
- `4` - Admin

All numeric codes are automatically transformed to readable strings in API responses using the transformer utilities.

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Development

### Project Structure
```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
│   ├── database.ts # Database connection
│   ├── status.ts   # Status code definitions
│   ├── transformers.ts # Data transformers
│   └── seedData.ts # Database seeding
└── index.ts        # Application entry point
```

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Security headers with Helmet
- Input validation with express-validator
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
