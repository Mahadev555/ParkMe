# ParkMe API - cURL Commands Reference

Complete cURL commands for all API endpoints. Copy and paste these directly into your terminal.

## 📌 Base URL
```
http://localhost:5000/api/v1
```

## 🔑 Variables (Replace These)
```bash
# After successful login, save the token:
TOKEN="your_token_here"

# After creating parking or booking, save the IDs:
PARKING_ID="parking_id_here"
BOOKING_ID="booking_id_here"
USER_ID="user_id_here"
```

---

# 🔐 Authentication Endpoints

## 1. Register User (Driver)
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "driver"
  }'
```

## 2. Register User (Owner)
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Owner",
    "email": "bob@example.com",
    "phone": "9876543211",
    "password": "password456",
    "confirmPassword": "password456",
    "role": "owner"
  }'
```

## 3. Login User
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the token from response!**

## 4. Get User Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

Replace `TOKEN` with your actual token from login.

---

# 🅿️ Parking Endpoints (Owner Only)

## 5. Create Parking Space (Protected - Owner)
```bash
curl -X POST http://localhost:5000/api/v1/parking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Downtown Premium Garage",
    "description": "Secure underground parking with surveillance",
    "address": "123 Main St, Downtown",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "pricePerHour": 6.99,
    "spacesAvailable": 15,
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
      },
      {
        "dayOfWeek": 2,
        "startTime": "06:00",
        "endTime": "23:00"
      },
      {
        "dayOfWeek": 3,
        "startTime": "06:00",
        "endTime": "23:00"
      },
      {
        "dayOfWeek": 4,
        "startTime": "06:00",
        "endTime": "23:00"
      },
      {
        "dayOfWeek": 5,
        "startTime": "07:00",
        "endTime": "21:00"
      },
      {
        "dayOfWeek": 6,
        "startTime": "08:00",
        "endTime": "20:00"
      }
    ]
  }'
```

**Save the parking _id from response!**

## 6. Get Owner's Parking Spaces (Protected - Owner)
```bash
curl -X GET "http://localhost:5000/api/v1/parking/owner?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

## 7. Get Parking by ID (Public)
```bash
curl -X GET http://localhost:5000/api/v1/parking/PARKING_ID
```

Replace `PARKING_ID` with actual parking ID.

## 8. Update Parking Space (Protected - Owner)
```bash
curl -X PUT http://localhost:5000/api/v1/parking/PARKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Updated Parking Title",
    "pricePerHour": 7.99,
    "spacesAvailable": 20
  }'
```

Replace `PARKING_ID` with actual parking ID.

## 9. Delete Parking Space (Protected - Owner)
```bash
curl -X DELETE http://localhost:5000/api/v1/parking/PARKING_ID \
  -H "Authorization: Bearer TOKEN"
```

Replace `PARKING_ID` with actual parking ID.

---

# 🔍 Search Endpoints

## 10. Search Parking by Location
```bash
curl -X GET "http://localhost:5000/api/v1/search?latitude=40.7128&longitude=-74.0060&radius=5000&maxPrice=10&page=1&limit=10"
```

**Query Parameters:**
- `latitude` - Your latitude (required)
- `longitude` - Your longitude (required)
- `radius` - Search radius in meters (optional, default: 5000)
- `minPrice` - Minimum price per hour (optional)
- `maxPrice` - Maximum price per hour (optional)
- `page` - Page number (optional, default: 1)
- `limit` - Items per page (optional, default: 10, max: 50)

## 11. Search with Price Filter
```bash
curl -X GET "http://localhost:5000/api/v1/search?latitude=40.7128&longitude=-74.0060&radius=10000&minPrice=3&maxPrice=8"
```

## 12. Get Trending Parking Spaces
```bash
curl -X GET "http://localhost:5000/api/v1/search/trending?limit=10"
```

---

# 📅 Booking Endpoints

## 13. Create Booking (Protected - Driver)
```bash
curl -X POST http://localhost:5000/api/v1/booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "parkingId": "PARKING_ID",
    "startTime": "2024-03-28T10:00:00Z",
    "endTime": "2024-03-28T14:00:00Z",
    "notes": "Need covered space"
  }'
```

**Important:**
- Replace `PARKING_ID` with actual parking ID
- Replace `TOKEN` with your driver token
- Use ISO 8601 format for dates: `YYYY-MM-DDTHH:mm:ssZ`
- Save the booking _id from response!

## 14. Get My Bookings (Protected - Driver)
```bash
curl -X GET "http://localhost:5000/api/v1/booking/my-bookings?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

## 15. Get Booking by ID (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/booking/BOOKING_ID \
  -H "Authorization: Bearer TOKEN"
```

Replace `BOOKING_ID` with actual booking ID.

## 16. Cancel Booking (Protected)
```bash
curl -X DELETE http://localhost:5000/api/v1/booking/BOOKING_ID \
  -H "Authorization: Bearer TOKEN"
```

Replace `BOOKING_ID` with actual booking ID.

---

# 💳 Payment Endpoints

## 17. Process Payment (Protected)

### Valid Card (Success)
```bash
curl -X POST http://localhost:5000/api/v1/payment/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID",
    "cardNumber": "4532123456789010",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardholderName": "John Doe"
  }'
```

### Declined Card (Failure - for testing)
```bash
curl -X POST http://localhost:5000/api/v1/payment/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID",
    "cardNumber": "5555555555555555",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardholderName": "John Doe"
  }'
```

**Mock Card Numbers:**
- ✅ **Valid**: `4532123456789010` (Success)
- ❌ **Declined**: `5555555555555555` (Will return error)

Replace `BOOKING_ID` and `TOKEN` with actual values.

## 18. Get Payment Status (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/payment/status/BOOKING_ID \
  -H "Authorization: Bearer TOKEN"
```

Replace `BOOKING_ID` and `TOKEN` with actual values.

---

# 🧪 Complete Workflow Example

## Step 1: Register as Driver
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

**Copy the `token` from response**

## Step 2: Login to Get Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Copy the `token` and save as**: `DRIVER_TOKEN`

## Step 3: Get Your Profile
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

## Step 4: Register as Owner
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Owner",
    "email": "bob@example.com",
    "phone": "9876543211",
    "password": "password456",
    "confirmPassword": "password456",
    "role": "owner"
  }'
```

**Copy the `token` and save as**: `OWNER_TOKEN`

## Step 5: Login as Owner
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "password456"
  }'
```

**Copy the `token` and save as**: `OWNER_TOKEN`

## Step 6: Create Parking Space (Owner)
```bash
curl -X POST http://localhost:5000/api/v1/parking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer OWNER_TOKEN" \
  -d '{
    "title": "Downtown Garage",
    "description": "Secure parking",
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "pricePerHour": 5.99,
    "spacesAvailable": 10
  }'
```

**Copy the `_id` from response and save as**: `PARKING_ID`

## Step 7: Search Parking (Driver)
```bash
curl -X GET "http://localhost:5000/api/v1/search?latitude=40.7128&longitude=-74.0060&radius=5000"
```

## Step 8: Create Booking (Driver)
```bash
curl -X POST http://localhost:5000/api/v1/booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -d '{
    "parkingId": "PARKING_ID",
    "startTime": "2024-03-28T10:00:00Z",
    "endTime": "2024-03-28T14:00:00Z",
    "notes": "Need covered space"
  }'
```

**Copy the `_id` from response and save as**: `BOOKING_ID`

## Step 9: Process Payment (Driver)
```bash
curl -X POST http://localhost:5000/api/v1/payment/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID",
    "cardNumber": "4532123456789010",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardholderName": "Jane Driver"
  }'
```

## Step 10: Check Payment Status (Driver)
```bash
curl -X GET http://localhost:5000/api/v1/payment/status/BOOKING_ID \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

---

# 🛠️ Useful Tips

## Save Response to Variable (Bash)
```bash
# Get token
RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}')

# Extract token using jq
TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# Use token in next request
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Pretty Print JSON Response
```bash
# Add | jq at the end of any curl command
curl -X GET http://localhost:5000 | jq

# or with formatting
curl -X GET http://localhost:5000 | jq '.'
```

## Save Response to File
```bash
curl -X GET http://localhost:5000 > response.json
```

## Verbose Output (Debug)
```bash
curl -v -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Set Timeout
```bash
curl --max-time 10 http://localhost:5000
```

---

# 📋 Quick Reference Table

| # | Endpoint | Method | Protected | Description |
|----|----------|--------|-----------|-------------|
| 1 | `/auth/register` | POST | No | Register user |
| 2 | `/auth/login` | POST | No | Login user |
| 3 | `/auth/profile` | GET | Yes | Get profile |
| 4 | `/parking` | POST | Yes | Create parking |
| 5 | `/parking/owner` | GET | Yes | Get owner's parking |
| 6 | `/parking/:id` | GET | No | Get parking details |
| 7 | `/parking/:id` | PUT | Yes | Update parking |
| 8 | `/parking/:id` | DELETE | Yes | Delete parking |
| 9 | `/search` | GET | No | Search parking |
| 10 | `/search/trending` | GET | No | Get trending parking |
| 11 | `/booking` | POST | Yes | Create booking |
| 12 | `/booking/my-bookings` | GET | Yes | Get user bookings |
| 13 | `/booking/:id` | GET | Yes | Get booking details |
| 14 | `/booking/:id` | DELETE | Yes | Cancel booking |
| 15 | `/payment/pay` | POST | Yes | Process payment |
| 16 | `/payment/status/:id` | GET | Yes | Get payment status |

---

# ⚠️ Important Notes

1. **Always include `Content-Type: application/json` header** for POST/PUT requests
2. **Use `Authorization: Bearer TOKEN`** for protected endpoints
3. **Phone must be 10 digits** (e.g., `9876543210`)
4. **Password minimum 6 characters**
5. **Dates must be ISO 8601 format** (e.g., `2024-03-28T10:00:00Z`)
6. **Replace placeholders** (TOKEN, PARKING_ID, etc.) with actual values
7. **Valid mock card**: `4532123456789010`
8. **Declined mock card**: `5555555555555555`
9. **Role must be** `driver` or `owner`
10. **All coordinates** in format: latitude (North/South), longitude (East/West)

---

# 🚀 Quick Start

Copy & modify these three commands to get started:

```bash
# 1. Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"you@example.com","phone":"9876543210","password":"pass123","confirmPassword":"pass123","role":"driver"}'

# 2. Login (copy token)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"pass123"}'

# 3. Get Profile (replace TOKEN)
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

---

Good luck! 🎉
