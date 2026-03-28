# ParkMe Frontend

Modern, production-ready React frontend for the ParkMe parking marketplace app. Built with Vite, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Modern Design**: Clean, minimal SaaS-style UI with soft shadows and glassmorphism
- **Smooth Animations**: Framer Motion for page transitions and interactive elements
- **Responsive**: Mobile-first design that works on all devices
- **Authentication**: JWT-based auth with protected routes
- **Real-time Search**: Find parking spaces by location with distance calculation
- **Booking System**: Reserve parking with time selection and price calculation
- **State Management**: Context API for global auth state

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool (faster than Webpack) |
| **Tailwind CSS** | Utility-first CSS styling |
| **React Router** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Beautiful icons |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx      # Button with variants
│   │   ├── Input.jsx       # Form input with validation
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── ParkingCard.jsx # Parking space card
│   │   ├── Modal.jsx       # Modal dialog
│   │   ├── Loader.jsx      # Loading spinner & skeletons
│   │   └── index.js        # Component exports
│   │
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx # Home page with hero
│   │   ├── LoginPage.jsx   # Login form
│   │   ├── RegisterPage.jsx# Registration form
│   │   ├── SearchPage.jsx  # Parking search
│   │   └── ParkingDetailsPage.jsx # Booking page
│   │
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   │
│   ├── services/
│   │   └── api.js         # Axios instance with interceptors
│   │
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles + Tailwind
│
├── public/                 # Static assets
├── index.html             # HTML template
├── .env                   # Environment variables
├── .env.example           # Environment template
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- ParkMe backend running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (copy from .env.example)
```bash
cp .env.example .env
```

4. **Update .env with your backend URL**
```
VITE_API_URL=http://localhost:5000/api/v1
```

5. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📱 Pages & Routes

| Route | Page | Protected | Role |
|-------|------|-----------|------|
| `/` | Landing | No | Public |
| `/login` | Login | No | Public |
| `/register` | Register | No | Public |
| `/search` | Find Parking | Yes | Driver |
| `/parking/:id` | Booking | Yes | Driver |

## 🔑 Key Features

### Authentication
- Login with email + password
- Register as Driver or Owner
- JWT token stored in localStorage
- Auto-logout on token expiration
- Protected routes via ProtectedRoute component

### API Integration
- Axios instance with base URL
- Auto-include JWT token in headers
- Error handling & 401 redirects
- Built-in request/response interceptors

### Form Validation
- Real-time validation
- Error messages below fields
- Floating labels
- Required field indicators
- Password strength hints

### UI Components
- **Button**: Primary, secondary, outline, ghost variants
- **Input**: Text, email, password, number with icons
- **ParkingCard**: Responsive parking space display
- **Modal**: Booking confirmation dialog
- **Loader**: Spinner & skeleton screens
- **Navbar**: Responsive with mobile menu

### Animations
- Page transitions (Framer Motion)
- Button hover effects
- Card hover animations
- Modal entrance animations
- Smooth scrolling

## 📡 API Endpoints Used

### Auth
```
POST   /auth/register    - User registration
POST   /auth/login       - User login
GET    /auth/profile     - Get user profile
```

### Parking
```
GET    /search           - Search parking by location
GET    /search/trending  - Get trending parking
GET    /parking/:id      - Get parking details
```

### Booking
```
POST   /booking          - Create booking
GET    /booking/:id      - Get booking details
GET    /booking/my-bookings - User's bookings
DELETE /booking/:id      - Cancel booking
```

### Payment
```
POST   /payment/pay      - Process payment
GET    /payment/status/:id - Payment status
```

## 🎨 Styling

### Color Palette
- **Primary**: Blue shades (500-900)
- **Secondary**: Purple shades (500-900)
- **Neutral**: Slate shades (50-900)

### Custom Classes
```css
.glass         /* Glassmorphism effect */
.glass-dark    /* Dark glassmorphism */
.btn-primary   /* Primary button */
.btn-secondary /* Secondary button */
.input-primary /* Primary input */
.card          /* Card component */
.card-hover    /* Hover card effect */
```

## 🔐 Environment Variables

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Application
VITE_APP_NAME=ParkMe
VITE_APP_VERSION=1.0.0
```

## 📝 Component Examples

### Using Button Component
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Using Input Component
```jsx
<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
  required
  icon={Mail}
/>
```

### Using ParkingCard
```jsx
<ParkingCard
  parking={parkingData}
  distance={5000}
  onBook={() => handleBook(parkingData._id)}
/>
```

### Using Protected Routes
```jsx
<Route
  path="/search"
  element={
    <ProtectedRoute requiredRole="driver">
      <SearchPage />
    </ProtectedRoute>
  }
/>
```

## 🔄 State Management

### Auth Context
```jsx
const { 
  user,           // Current user object
  token,          // JWT token
  isAuthenticated, // Boolean
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  loading,        // Loading state
  error,          // Error message
} = useAuth()
```

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📦 Build Output

```bash
npm run build
```

Creates optimized production build in `dist/` directory. Ready to deploy to Netlify, Vercel, or any static host.

## 🚀 Deployment

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 🐛 Troubleshooting

### API Connection Failed
- Ensure backend is running on `http://localhost:5000`
- Check `.env` file has correct `VITE_API_URL`
- Check CORS is enabled on backend

### Login Not Working
- Verify user exists in backend
- Check MongoDB is running
- Check backend logs for errors
- Clear localStorage and try again

### Styles Not Applied
- Run `npm install` to ensure Tailwind is installed
- Restart dev server
- Check browser cache (hard refresh: Ctrl+Shift+R)

### Blank Page
- Check browser console for errors
- Verify all imports are correct
- Check `src/App.jsx` routing

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [React Router Documentation](https://reactrouter.com)
- [Lucide React Icons](https://lucide.dev)

## 📄 License

MIT License - feel free to use this code for your projects

## 👨‍💻 Support

For issues or questions, refer to the backend README and API documentation.

---

**Happy coding! 🚀**
