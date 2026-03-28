# ParkMe Frontend - Quick Start Guide

Get the ParkMe frontend running in 5 minutes!

## ⚡ Quick Setup

### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Configure Environment
```bash
cp .env.example .env
```

Make sure `.env` has:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### 3️⃣ Start Dev Server
```bash
npm run dev
```

✅ Frontend opens at `http://localhost:3000`

---

## 🎯 Test the App

### Register New User (Driver)
1. Click "Register" button
2. Select **"Find Parking"** role
3. Fill in details:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: password123
4. Click "Create Account"

### Search for Parking
1. Click "Find Parking Now"
2. Enter location (or click 📍 for current location):
   - Latitude: `40.7128`
   - Longitude: `-74.0060`
3. Click "Search Parking"
4. See available parking spaces

### Book Parking
1. Click "View & Book" on any parking card
2. Select:
   - Start date/time
   - End date/time
3. Review total price
4. Click "Confirm & Pay"

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app & routes |
| `src/context/AuthContext.jsx` | Auth state |
| `src/services/api.js` | API configuration |
| `.env` | Environment variables |
| `tailwind.config.js` | Styling config |

---

## 🚀 Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder - ready to deploy!

---

## ❓ Common Issues

### Port 3000 Already in Use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### API Connection Error?
```bash
# Check backend is running
curl http://localhost:5000

# Update .env
VITE_API_URL=http://localhost:5000/api/v1
```

### Blank Page?
- Open browser console (F12)
- Check for errors
- Hard refresh (Ctrl+Shift+R)
- Restart dev server

---

## 📚 Next Steps

1. ✅ Install & Run
2. ✅ Register & Login
3. ✅ Search Parking
4. ✅ Book a Spot
5. ✅ Test Payment (UI only)
6. 📖 Read full [README.md](./README.md)

---

## 🔗 Links

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **API Docs**: [CURL_COMMANDS.md](../backend/CURL_COMMANDS.md)

---

**Full documentation**: See [README.md](./README.md)

Good luck! 🎉
