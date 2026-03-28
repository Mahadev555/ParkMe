# ParkMe Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Edit `.env` File
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/parkme
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### 4. Ensure MongoDB is Running
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Windows (MongoDB as service)
net start MongoDB

# Or run locally
mongod
```

### 5. Start Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

### 6. Test API
```bash
# Health check
curl http://localhost:5000/health

# Get API info
curl http://localhost:5000
```

## 📱 Quick API Test Sequence

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "driver"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Save the token from response for next step**

### 3. Get Profile (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### 4. Search Parking
```bash
curl -X GET "http://localhost:5000/api/v1/search?latitude=40.7128&longitude=-74.0060&radius=5000"
```

### 5. Create Booking (replace TOKEN and PARKING_ID)
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

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/server.js` | Entry point - starts the server |
| `src/app.js` | Express app configuration |
| `src/routes/` | API endpoint definitions |
| `src/controllers/` | Request handlers |
| `src/services/` | Business logic |
| `src/models/` | Database schemas |
| `src/middleware/` | Custom middleware |
| `src/utils/` | Helper functions |
| `.env` | Environment variables |

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# View logs
tail -f logs/app.log

# Connect to MongoDB
mongosh  # or mongo
use parkme
db.users.find()

# Install new package
npm install package-name
```

## ⚠️ Important Notes

1. **Change JWT_SECRET in production** - Use `openssl rand -base64 32`
2. **Use strong passwords** - Minimum 6 characters
3. **Keep .env file secure** - Never commit to git
4. **Use HTTPS in production** - Not just HTTP
5. **Set CORS_ORIGIN to frontend URL** - Restricts requests

## 🐛 Debugging

Enable debug logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

Check server logs:
```bash
# See all logs
tail -f logs/*.log

# Or in terminal output when running npm run dev
```

## 📚 Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Joi Validation](https://joi.dev/)

## 💡 Next Steps

1. Read full [README.md](./README.md) for complete API documentation
2. Test all endpoints using Postman or Insomnia
3. Set up frontend to consume API
4. Configure production database (MongoDB Atlas)
5. Deploy to cloud platform (AWS, Heroku, etc.)

---

Need help? Check README.md for detailed API documentation!
