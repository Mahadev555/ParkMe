# 🅿️ ParkMe Backend - Production Ready Parking Marketplace API

A powerful, scalable backend for the ParkMe parking marketplace application built with Node.js, Express, MongoDB, and JWT authentication.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Sample Requests](#sample-requests)
- [Database Indexes](#database-indexes)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Features
- ✅ **Dual-role Authentication**: Register and login for both drivers and parking owners
- ✅ **JWT Token Authentication**: Secure token-based authentication
- ✅ **Parking Space Management**: Full CRUD operations for parking owners
- ✅ **Advanced Search**: Geolocation-based parking search with filters
- ✅ **Booking System**: Book parking slots with conflict prevention
- ✅ **Mock Payment Processing**: Simulated payment gateway integration
- ✅ **Role-based Access Control**: Owner vs Driver permissions
- ✅ **Pagination**: List endpoints support pagination
- ✅ **Error Handling**: Centralized error handling with meaningful responses

### Advanced Features
- 🌍 **Geospatial Queries**: MongoDB 2dsphere indexes for location-based search
- 📊 **Pagination Support**: Configurable page size and offset
- 🔐 **Password Hashing**: Bcrypt password encryption
- ⚡ **Input Validation**: Joi schema validation for all endpoints
- 📝 **Request Logging**: Comprehensive request/response logging
- 🛡️ **Security Headers**: Helmet.js for security hardening
- 🌐 **CORS Support**: Configurable CORS for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs
- **Validation**: Joi
- **Security**: Helmet.js
- **CORS**: cors middleware
- **Error Handling**: express-async-errors

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── parkingController.js
│   │   ├── searchController.js
│   │   ├── bookingController.js
│   │   └── paymentController.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── parkingRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── paymentRoutes.js
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Parking.js
│   │   └── Booking.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── parkingService.js
│   │   ├── searchService.js
│   │   ├── bookingService.js
│   │   └── paymentService.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── jwt.js
│   │   ├── validation.js
│   │   ├── pagination.js
│   │   └── logger.js
│   ├── config/              # Configuration
│   │   ├── database.js
│   │   └── env.js
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── package.json
├── .env.example
└── README.md

```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Update environment variables in .env** (see Configuration section)

5. **Install MongoDB locally (optional)**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb
```

## ⚙️ Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/parkme

# MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parkme

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# API Configuration
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### Important Security Notes
⚠️ **DO NOT** use default JWT_SECRET in production
- Generate a strong secret: `openssl rand -base64 32`
- Rotate secrets regularly
- Use environment variables for sensitive data

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```
Requires `nodemon` to be installed

### Production Mode
```bash
npm start
```

### Expected Output
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
Environment: development
API URL: http://localhost:5000/api/v1
```

### Verify Server is Running
```bash
curl http://localhost:5000
# or visit http://localhost:5000 in browser
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Header
All protected routes require:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "secure123",
  "confirmPassword": "secure123",
  "role": "driver"  // or "owner"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "driver",
      "isActive": true
    },
    "token": "eyJhbGc..."
  },
  "message": "User registered successfully",
  "success": true
}
```

### 2. Login User
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {...},
    "token": "eyJhbGc..."
  },
  "message": "Login successful",
  "success": true
}
```

### 3. Get User Profile
**Endpoint:** `GET /auth/profile`
**Protected:** Yes (requires auth token)

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "driver"
  },
  "message": "Profile fetched successfully",
  "success": true
}
```

---

## 🅿️ Parking Endpoints (Owner Only)

### 1. Create Parking Space
**Endpoint:** `POST /parking`
**Protected:** Yes | **Role:** owner

**Request:**
```json
{
  "title": "Downtown Parking Lot",
  "description": "Secure underground parking",
  "address": "123 Main St, City Center",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "pricePerHour": 5.99,
  "spacesAvailable": 10,
  "availability": [
    {
      "dayOfWeek": 0,
      "startTime": "06:00",
      "endTime": "22:00"
    },
    {
      "dayOfWeek": 1,
      "startTime": "06:00",
      "endTime": "23:00"
    }
  ]
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "ownerId": "...",
    "title": "Downtown Parking Lot",
    "address": "123 Main St, City Center",
    "location": {
      "type": "Point",
      "coordinates": [-74.0060, 40.7128]
    },
    "pricePerHour": 5.99,
    "isActive": true
  },
  "message": "Parking space created successfully",
  "success": true
}
```

### 2. Get Owner's Parking Spaces
**Endpoint:** `GET /parking/owner?page=1&limit=10`
**Protected:** Yes | **Role:** owner

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "items": [...],
    "pagination": {
      "current": 1,
      "pageSize": 10,
      "total": 25,
      "totalPages": 3,
      "hasMore": true
    }
  },
  "message": "Parking spaces fetched successfully",
  "success": true
}
```

### 3. Get Parking by ID
**Endpoint:** `GET /parking/:id`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {...},
  "message": "Parking space fetched successfully",
  "success": true
}
```

### 4. Update Parking Space
**Endpoint:** `PUT /parking/:id`
**Protected:** Yes | **Role:** owner

**Request:** (Any fields to update)
```json
{
  "title": "Updated Title",
  "pricePerHour": 6.99,
  "isActive": true
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {...},
  "message": "Parking space updated successfully",
  "success": true
}
```

### 5. Delete Parking Space
**Endpoint:** `DELETE /parking/:id`
**Protected:** Yes | **Role:** owner

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Parking space deleted successfully",
  "success": true
}
```

---

## 🔍 Search Endpoints

### Search Parking Spaces
**Endpoint:** `GET /search?latitude=40.7128&longitude=-74.0060&radius=5000&maxPrice=10&page=1&limit=10`

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radius` (optional): Search radius in meters (default: 5000)
- `minPrice` (optional): Minimum price per hour
- `maxPrice` (optional): Maximum price per hour
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "_id": "...",
        "title": "Downtown Parking",
        "address": "123 Main St",
        "pricePerHour": 5.99,
        "distance": 250  // in meters
      }
    ],
    "pagination": {
      "current": 1,
      "pageSize": 10,
      "total": 45,
      "totalPages": 5,
      "hasMore": true
    }
  },
  "message": "Parking spaces retrieved successfully",
  "success": true
}
```

### Get Trending Parking
**Endpoint:** `GET /search/trending?limit=10`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [...],
  "message": "Trending parking spaces retrieved successfully",
  "success": true
}
```

---

## 📅 Booking Endpoints (Driver Only)

### 1. Create Booking
**Endpoint:** `POST /booking`
**Protected:** Yes | **Role:** driver

**Request:**
```json
{
  "parkingId": "507f1f77bcf86cd799439011",
  "startTime": "2024-03-28T10:00:00Z",
  "endTime": "2024-03-28T14:00:00Z",
  "notes": "Need covered space"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "userId": "...",
    "parkingId": "...",
    "startTime": "2024-03-28T10:00:00Z",
    "endTime": "2024-03-28T14:00:00Z",
    "totalPrice": 23.96,
    "status": "pending",
    "paymentStatus": "unpaid"
  },
  "message": "Booking created successfully",
  "success": true
}
```

### 2. Get My Bookings
**Endpoint:** `GET /booking/my-bookings?page=1&limit=10`
**Protected:** Yes | **Role:** driver

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "items": [...],
    "pagination": {...}
  },
  "message": "Bookings fetched successfully",
  "success": true
}
```

### 3. Get Booking by ID
**Endpoint:** `GET /booking/:id`
**Protected:** Yes

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {...},
  "message": "Booking fetched successfully",
  "success": true
}
```

### 4. Cancel Booking
**Endpoint:** `DELETE /booking/:id`
**Protected:** Yes

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "status": "cancelled"
  },
  "message": "Booking cancelled successfully",
  "success": true
}
```

---

## 💳 Payment Endpoints

### 1. Process Payment
**Endpoint:** `POST /payment/pay`
**Protected:** Yes

**Request:**
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "cardNumber": "4532123456789010",
  "expiryDate": "12/25",
  "cvv": "123",
  "cardholderName": "John Doe"
}
```

**Mock Card Numbers:**
- ✅ Valid: `4532123456789010`
- ❌ Declined: `5555555555555555`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "success": true,
    "message": "Payment processed successfully",
    "paymentId": "PAY_1711612345678_abc123def456",
    "booking": {...}
  },
  "message": "Payment processed successfully",
  "success": true
}
```

### 2. Get Payment Status
**Endpoint:** `GET /payment/status/:bookingId`
**Protected:** Yes

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "bookingId": "...",
    "amount": 23.96,
    "status": "paid",
    "paymentId": "PAY_..."
  },
  "message": "Payment status retrieved successfully",
  "success": true
}
```

---

## 📝 Sample Requests

### Complete Workflow Example

#### Step 1: Register as Driver
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Driver",
    "email": "jane@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "driver"
  }'
```

#### Step 2: Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for authenticated requests.

#### Step 3: Search Parking
```bash
curl -X GET "http://localhost:5000/api/v1/search?latitude=40.7128&longitude=-74.0060&radius=5000&maxPrice=10" \
  -H "Content-Type: application/json"
```

#### Step 4: Create Booking
```bash
curl -X POST http://localhost:5000/api/v1/booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "parkingId": "PARKING_ID_FROM_SEARCH",
    "startTime": "2024-03-28T10:00:00Z",
    "endTime": "2024-03-28T14:00:00Z",
    "notes": "Need covered space"
  }'
```

#### Step 5: Process Payment
```bash
curl -X POST http://localhost:5000/api/v1/payment/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bookingId": "BOOKING_ID_FROM_PREVIOUS_STEP",
    "cardNumber": "4532123456789010",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardholderName": "Jane Driver"
  }'
```

---

## 📊 Database Indexes

The application includes the following MongoDB indexes for optimal performance:

### User Collection
```javascript
// Email and phone uniqueness
email: { unique: true }
phone: { unique: true }
```

### Parking Collection
```javascript
// Geospatial index for location queries
location: '2dsphere'

// Regular indexes
ownerId: 1
isActive: 1
pricePerHour: 1
```

### Booking Collection
```javascript
// Efficient filtering
userId: 1, createdAt: -1
parkingId: 1
status: 1
startTime: 1, endTime: 1
```

Create indexes manually:
```javascript
// In MongoDB shell
db.parkings.createIndex({ "location": "2dsphere" })
```

---

## 🏆 Best Practices Implemented

### ✅ Clean Architecture
- Separation of concerns (controllers, services, models)
- Single Responsibility Principle
- Easy to test and maintain

### ✅ Error Handling
- Centralized error handler middleware
- Consistent error response format
- Meaningful error messages

### ✅ Security
- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation with Joi
- Security headers with Helmet.js
- CORS protection

### ✅ Code Quality
- Comprehensive comments and documentation
- Consistent naming conventions
- Modular route structure
- Reusable utility functions
- Async/await for clean async code

### ✅ Performance
- Database indexing for fast queries
- Geospatial queries for location search
- Pagination for large datasets
- Connection pooling

### ✅ Logging
- Request logging with timestamps
- Error logging with details
- Debug mode for development

---

## 🔍 Troubleshooting

### MongoDB Connection Error
**Problem:** `MongoError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running:
```bash
# Check MongoDB status
mongod --version

# Start MongoDB
mongod  # macOS/Linux
# or on Windows: net start MongoDB
```

2. Verify connection string in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/parkme
```

### CORS Error
**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
Update `CORS_ORIGIN` in `.env`:
```env
CORS_ORIGIN=http://localhost:3000  # Your frontend URL
```

### Authentication Failing
**Problem:** `401 Unauthorized: Invalid token`

**Solution:**
1. Ensure token is included in header:
```bash
curl -H "Authorization: Bearer <token>"
```

2. Check token hasn't expired
3. Verify JWT_SECRET hasn't changed

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill process using port 5000
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📈 Scaling Considerations

For production deployment:

1. **Database**
   - Use MongoDB Atlas (cloud) instead of local
   - Enable auto-scaling
   - Set up read replicas

2. **Caching**
   - Add Redis for caching frequently accessed data
   - Cache parking search results

3. **Authentication**
   - Implement refresh tokens
   - Add password reset functionality
   - Enable 2FA

4. **Payment**
   - Integrate real payment gateway (Stripe, PayPal)
   - Implement webhooks for payment verification
   - Add transaction logging

5. **Deployment**
   - Use Docker containers
   - Deploy to cloud (AWS, Azure, GCP)
   - Set up CI/CD pipeline
   - Use environment variables for secrets

6. **Monitoring**
   - Add APM (Application Performance Monitoring)
   - Set up alerts for errors
   - Log aggregation with ELK stack

---

## 📄 License

MIT License - feel free to use this project as a template

## 👨‍💻 Author

ParkMe Development Team

---

**Happy Coding! 🚀**
