# 🏥 Hospital Management System - Run Instructions

## Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun** installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Step 1: Navigate to Project Directory
```bash
cd Hospital-Management-System/next-shadcn-dashboard-starter
```

### Step 2: Install Dependencies
```bash
npm install
# or
bun install
# or
yarn install
```

### Step 3: Start Development Server
```bash
npm run dev
# or
bun dev
# or
yarn dev
```

### Step 4: Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

You'll be automatically redirected to the dashboard at:
```
http://localhost:3000/dashboard/overview
```

## Available Pages

- **Dashboard**: http://localhost:3000/dashboard/overview
- **Patients**: http://localhost:3000/dashboard/patients
- **Doctors**: http://localhost:3000/dashboard/doctors
- **Beds**: http://localhost:3000/dashboard/beds
- **Profile**: http://localhost:3000/dashboard/profile

## First Time Setup

The system automatically creates:
- ✅ 3 sample doctors
- ✅ 20 beds (various types)
- ✅ Empty patient list

Data is stored in JSON files in the `data/` directory.

## Features to Test

1. **Dashboard**
   - View real-time statistics
   - Check bed availability charts
   - Toggle dark theme

2. **Patient Management**
   - Add new patients
   - View patient list
   - Edit patient information
   - Discharge patients
   - Track symptoms and medical history

3. **Doctor Management**
   - Add doctors with specializations
   - View all doctors
   - Edit doctor information
   - Delete doctors (with validation)

4. **Bed Management**
   - Add beds with different types
   - View bed availability
   - Edit bed information
   - Delete beds (with validation)

## Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Data Not Persisting
- Check that `data/` directory exists
- Ensure write permissions on the directory
- Check console for errors

### Build Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

## Environment Variables (Optional)

Create a `.env.local` file for Clerk authentication (optional):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

**Note**: The app works without authentication for testing purposes.

## Project Structure

```
next-shadcn-dashboard-starter/
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── api/         # API endpoints
│   │   └── dashboard/   # Dashboard pages
│   ├── components/      # Reusable UI components
│   ├── features/        # Feature modules
│   │   └── hospital/    # Hospital-specific features
│   ├── lib/            # Utilities
│   │   └── db.ts       # Database operations
│   └── types/          # TypeScript types
├── data/               # JSON data storage
├── public/             # Static assets
└── package.json        # Dependencies
```

## Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run lint:fix     # Fix linting errors
```

## Support

For detailed documentation, see:
- `README.md` - Full documentation
- `TESTING.md` - Testing guide
- `QUICKSTART.md` - Quick start guide

---

**Ready to use!** 🚀

