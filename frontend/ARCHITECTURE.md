# ParkMe Frontend Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React App (Frontend)                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Pages      │  │  Components  │  │   Hooks      │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│  │ Landing      │  │ Button       │  │ useAuth      │   │
│  │ Auth         │  │ Input        │  │ useContext   │   │
│  │ Search       │  │ Navbar       │  │ useState     │   │
│  │ Details      │  │ Card         │  │ useEffect    │   │
│  │ Booking      │  │ Modal        │  │ useNavigate  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         △                 △                    △          │
│         │                 │                    │          │
│         └─────────────────┴────────────────────┘          │
│                      Context API                          │
│                   (AuthContext)                           │
│                         △                                 │
└─────────────────────────┼─────────────────────────────────┘
                          │
                          │ (axios interceptors)
                          │
             ┌────────────┴────────────┐
             │                         │
        ┌────▼───────┐        ┌───────▼────┐
        │  Verifying │        │ Calling    │
        │  JWT Token │        │ API Methods│
        │  (Auth)    │        │            │
        └────┬───────┘        └───────┬────┘
             │                        │
             └────────────┬───────────┘
                          │
                  ┌───────▼────────┐
                  │   Axios API    │
                  │  (api.js)      │
                  └───────┬────────┘
                          │
                      HTTP(S)
                          │
             ┌────────────▼────────────┐
             │                         │
        ┌────▼────────────┐   ┌───────▼────────┐
        │  Auth Endpoints │   │ Parking        │
        │  /register      │   │ Endpoints      │
        │  /login         │   │ /search        │
        │  /profile       │   │ /parking       │
        └─────────────────┘   │ /booking       │
                              │ /payment       │
                              └────┬───────────┘
                                   │
                              Backend API
                          (Node.js + Express)
```

## 📊 Data Flow

### 1️⃣ Authentication Flow

```
User Registration
     │
     ▼
RegisterPage.jsx
     │
     ├─ Validates form data
     │
     ├─ Calls: useAuth().register()
     │
     ├─ AuthContext sends POST to /auth/register
     │
     ├─ API receives response with token
     │
     ├─ Token saved to localStorage
     │
     ├─ User state updated in AuthContext
     │
     └─ Redirect to Dashboard
```

### 2️⃣ Parking Search Flow

```
SearchPage.jsx
     │
     ├─ Get user location (geolocation API)
     │
     ├─ OR user enters latitude/longitude
     │
     ├─ Apply filters (radius, price)
     │
     ├─ Call: API.get('/search?lat=...&lng=...')
     │
     ├─ Axios includes JWT token in header
     │
     ├─ Backend validates token & searches DB
     │
     ├─ Response: Array of parking spaces
     │
     ├─ Map to ParkingCard components
     │
     └─ Display with distance calculation
```

### 3️⃣ Booking Flow

```
ParkingDetailsPage.jsx
     │
     ├─ User selects start & end time
     │
     ├─ Calculate total hours & price
     │
     ├─ Click "Confirm & Pay"
     │
     ├─ Show confirmation modal
     │
     ├─ Call: API.post('/booking', { parkingId, startTime, endTime })
     │
     ├─ Backend checks for conflicts
     │
     ├─ Backend creates booking
     │
     ├─ Response: Booking ID
     │
     └─ Redirect to Payment Page
```

## 🔑 Key Concepts

### Context API (AuthContext)

```javascript
// Global state for authentication
const { 
  user,              // { _id, name, email, role, ... }
  token,             // JWT token string
  isAuthenticated,   // boolean
  loading,           // boolean
  login,             // async function
  register,          // async function
  logout,            // function
} = useAuth()
```

### Axios Interceptors

```javascript
// Request Interceptor
GET Authorization header
    └─ Add token: "Bearer TOKEN"

// Response Interceptor
Response status 401 (Unauthorized)
    └─ Clear localStorage
    └─ Redirect to /login
```

### Protected Routes

```javascript
<Route
  path="/search"
  element={
    <ProtectedRoute requiredRole="driver">
      <SearchPage />
    </ProtectedRoute>
  }
/>

// If not authenticated → redirect to /login
// If authenticated but wrong role → redirect to /
```

## 🗂️ File Organization

### Components (Reusable)

```
src/components/
├── Button.jsx        - CTAs, form submissions, actions
├── Input.jsx         - Text fields, validation, icons
├── Navbar.jsx        - Navigation, user menu, auth links
├── ParkingCard.jsx   - Parking space display
├── Modal.jsx         - Dialogs, confirmations
├── Loader.jsx        - Spinners, skeletons
└── ProtectedRoute.jsx - Route authentication guard
```

### Pages (Screen Components)

```
src/pages/
├── LandingPage.jsx        - Home, hero, features
├── LoginPage.jsx          - Email + password login
├── RegisterPage.jsx       - Registration with role selection
├── SearchPage.jsx         - Find parking by location
└── ParkingDetailsPage.jsx - View details & book
```

### State Management

```
src/context/
└── AuthContext.jsx - Global auth state & functions
```

### Services (API)

```
src/services/
└── api.js - Axios instance, interceptors, base config
```

## 🔄 Component Communication

### Parent → Child (Props)
```jsx
<ParkingCard 
  parking={parkingData}
  distance={5000}
  onBook={handleBook}
/>
```

### Child → Parent (Callbacks)
```jsx
// In child component
onClick={() => onBook(parkingId)}

// In parent component
const handleBook = (parkingId) => {
  navigate(`/parking/${parkingId}`)
}
```

### Global State (Context)
```jsx
// Any component can use auth context
const { user, logout } = useAuth()
```

## 🎨 Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Predefined classes (p-4, text-lg, bg-primary-500)
- Responsive prefixes (md:, lg:)
- Hover/focus states (hover:, focus:)

### Custom Classes (index.css)
```css
.glass              - Glassmorphism effect
.card               - Card component base
.btn-primary        - Primary button
.input-primary      - Input field
.shimmer            - Loading animation
```

### Color System
```
Primary:   500-900 (blue shades)
Secondary: 500-900 (purple shades)  
Neutral:   50-900  (slate shades)
```

## 🔐 Security Features

### Authentication
- JWT tokens in localStorage
- Token validation on every API call
- Auto-logout on 401 response
- Password field type with show/hide toggle

### Validation
- Client-side form validation
- Input type checking
- Error messages displayed
- Required field indicators

### CORS & Headers
- Content-Type: application/json
- Authorization: Bearer TOKEN
- Axios interceptors handle headers

## 📈 Performance Optimizations

### Code Splitting
- Routes lazy-loaded with React Router
- Components split into modules
- Services separated for reusability

### Animations
- Framer Motion for smooth transitions
- GPU-accelerated transforms
- Optimized re-renders with motion.div

### Caching
- User data stored in localStorage
- Token persists across page reloads
- Prevents unnecessary API calls

## 🧪 Testing Points

| Feature | Test Path | Expected |
|---------|-----------|----------|
| Register | /register | Form validates, user created |
| Login | /login | Token stored, redirects |
| Search | /search | Results load, filters work |
| Book | /parking/id | Modal shows, calculates price |
| Auth Guard | Protected route | Redirects if not logged in |

## 🚀 Deployment Checklist

- [ ] Build frontend: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Update .env.example with production API URL
- [ ] Deploy dist/ folder to hosting
- [ ] Update backend CORS to allow frontend origin
- [ ] Test all auth flows in production
- [ ] Test all parking search/booking flows
- [ ] Monitor error logs

---

**Ready to deploy? See [README.md](./README.md) for deployment guides!**
