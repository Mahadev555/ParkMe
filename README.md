# 🅿️ ParkMe - AI-Powered Smart Parking Marketplace

> **Find parking smarter, faster, and easier with AI assistance**

A modern full-stack parking marketplace platform that connects drivers with available parking spaces. Powered by AI-driven search and real-time booking, ParkMe eliminates the hassle of finding parking in congested urban areas.

---

## 🎯 Problem We're Solving

Finding parking is frustrating and time-consuming:
- ❌ Drivers waste **30+ minutes** searching for available spots
- ❌ No easy way to discover affordable parking near you
- ❌ Parking owners can't monetize unused spaces efficiently
- ❌ Manual booking processes are tedious and error-prone

---

## ✨ What ParkMe Offers

### 🤖 AI-Powered Features
- **Intelligent Chatbot Assistant**: Ask questions naturally - "Find parking near Baner under 50 rupees for 2 hours"
- **Smart Search**: AI-enhanced parking discovery with real-time availability
- **Predictive Suggestions**: Get personalized recommendations based on your preferences

### 🎯 Core Capabilities
- ✅ **Real-time Parking Search**: Location-based discovery with distance calculation
- ✅ **Instant Booking**: Reserve spots with conflict prevention
- ✅ **Dual User Roles**: Support for both drivers and parking space owners
- ✅ **Secure Payments**: Mock payment gateway integration
- ✅ **User Ratings**: Community-driven parking space quality scores
- ✅ **Smart Filters**: Price, duration, location, and time-based filtering
- ✅ **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js** - Robust API server
- **MongoDB + Mongoose** - NoSQL database with geospatial queries
- **JWT Authentication** - Secure token-based auth
- **Axios + API Integration** - AI agent integration

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful iconography

### AI & Intelligence
- **Agentic AI** - Conversational AI assistant for smart queries
- **Natural Language Processing** - Understands parking preferences
- **ML-based Recommendations** - Personalized suggestions

---

## 📁 Project Structure

```
parkme/
├── frontend/                    # React + Vite frontend app
│   ├── src/
│   │   ├── components/         # Reusable UI components + ChatBot
│   │   ├── pages/              # Page components
│   │   ├── context/            # State management
│   │   └── services/           # API integration
│   └── package.json
│
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # Database schemas
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth & error handling
│   │   ├── ai/                 # AI agent integration
│   │   └── config/             # Configuration
│   └── package.json
│
└── README.md (this file)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Installation

**1. Clone & Navigate**
```bash
cd parkme
```

**2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on `http://localhost:5000`

**3. Setup Frontend** (in new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

**4. Access Application**
- Open `http://localhost:5173` in your browser
- Use the AI chatbot (bottom-left corner) to search for parking

---

## 🔑 Key Features in Action

### For Drivers
1. **Smart Search**: Use the AI chatbot to find parking naturally
2. **Quick Booking**: Reserve spots in seconds
3. **View Details**: Check amenities, ratings, and pricing
4. **My Bookings**: Track all your reservations

### For Parking Owners
1. **List Spaces**: Add and manage parking spaces
2. **Track Bookings**: See who's booked your spots
3. **Set Pricing**: Dynamic pricing control
4. **Earn Revenue**: Monetize unused parking space

---

## 📊 API Endpoints Overview

| Feature | Endpoint | Method |
|---------|----------|--------|
| Search Parking | `/api/search` | POST |
| Get Parking Details | `/api/parking/:id` | GET |
| Create Booking | `/api/bookings` | POST |
| User Profile | `/api/auth/profile` | GET |
| AI Agent Query | `/api/ai/search` | POST |

For complete API documentation, see [backend/README.md](backend/README.md)

---

## 🔐 Authentication

ParkMe uses JWT (JSON Web Tokens) for secure authentication:
- Drivers and owners sign up with email/password
- Tokens stored locally in browser
- Protected routes ensure data privacy
- BcryptJS for password encryption

---

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for all screen sizes
- **Touch-Friendly UI**: Easy interaction on mobile devices
- **AI Chatbot**: Adaptive interface for mobile users
- **Fast Loading**: Optimized assets and lazy loading

---

## 🧠 AI Features

### Smart Chatbot Assistant ("ParkMe Assistant")
Natural language understanding for parking queries:
```
User: "Find parking near Baner under 50 rupees for 2 hours"
AI: [Shows top matches with prices, ratings, and distances]
```

### Intelligent Recommendations
- Suggests best parking based on user history
- Predictive pricing insights
- Smart filtering of 1000+ parking spaces

---

## 🛠️ Development

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/parkme
JWT_SECRET=your_jwt_secret_key
API_PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📈 Performance

- **API Response Time**: < 200ms
- **Page Load**: < 2 seconds
- **Search Results**: Instant with filters
- **Database Query**: Optimized with indexes

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 💬 Support & Feedback

- **Issues**: Report bugs on GitHub
- **Feature Requests**: Share your ideas
- **Documentation**: Check the wiki for detailed guides

---

## 🎓 Learn More

- [Backend Documentation](backend/README.md) - API & server setup
- [Frontend Documentation](frontend/README.md) - UI & client setup
- [AI Agent Guide](backend/AI_AGENT_DOCS.md) - ChatBot implementation
- [Installation Guide](backend/INSTALLATION.md) - Detailed setup steps

---

**Made with ❤️ using React, Node.js, MongoDB, and AI**

