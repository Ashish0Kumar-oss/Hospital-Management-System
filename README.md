# Hospital Management System

A modern, fully functional hospital management system built with Next.js 16, React 19, TypeScript, and Shadcn UI.

## Features

### 🏥 Core Functionality
- **Patient Management**: Add, edit, view, and discharge patients
- **Doctor Management**: Manage medical staff with specializations
- **Bed Management**: Track bed availability and occupancy
- **Dashboard**: Real-time statistics and analytics

### 🎨 Modern UI/UX
- **Dark Theme Support**: Full dark mode with smooth transitions
- **Animations**: Smooth page transitions and hover effects
- **Responsive Design**: Works seamlessly on all devices
- **Modern Components**: Built with Shadcn UI components

### 📊 Dashboard Features
- Real-time statistics (patients, doctors, beds)
- Bed availability by type
- Recovery rate tracking
- Doctor-to-patient ratio
- Visual bed occupancy indicators

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: CSS animations with Tailwind
- **Data Storage**: JSON file-based (easily replaceable with database)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:
```bash
bun install
# or
npm install
```

2. Create a `.env.local` file (optional - for Clerk authentication):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

3. Run the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── patients/      # Patient CRUD endpoints
│   │   ├── doctors/       # Doctor CRUD endpoints
│   │   ├── beds/          # Bed CRUD endpoints
│   │   └── dashboard/     # Dashboard stats endpoint
│   └── dashboard/         # Dashboard pages
│       ├── overview/      # Main dashboard
│       ├── patients/      # Patient management
│       ├── doctors/       # Doctor management
│       └── beds/          # Bed management
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   └── forms/            # Form components
├── features/             # Feature modules
│   └── hospital/         # Hospital-specific features
├── lib/                  # Utilities
│   └── db.ts            # Database operations
└── types/               # TypeScript types
    └── hospital.ts      # Hospital domain types
```

## Data Storage

The system uses JSON file-based storage by default (in the `data/` directory). This is perfect for development and can be easily replaced with:
- PostgreSQL
- MySQL
- MongoDB
- Prisma ORM
- Any other database solution

## Features in Detail

### Patient Management
- Add new patients with full medical information
- Track symptoms (multi-select)
- Assign beds and doctors
- View patient history
- Discharge patients (automatically frees up beds)
- Soft delete support

### Doctor Management
- Add doctors with specializations
- Track patient assignments
- Contact information management
- Validation to prevent deletion of doctors with active patients

### Bed Management
- Add beds with types (General, ICU, Private, etc.)
- Real-time occupancy tracking
- Automatic bed assignment
- Validation to prevent deletion of occupied beds

## API Endpoints

### Patients
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/[id]` - Get patient details
- `PATCH /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient
- `POST /api/patients/[id]/discharge` - Discharge patient

### Doctors
- `GET /api/doctors` - List all doctors
- `POST /api/doctors` - Create new doctor
- `GET /api/doctors/[id]` - Get doctor details
- `PATCH /api/doctors/[id]` - Update doctor
- `DELETE /api/doctors/[id]` - Delete doctor

### Beds
- `GET /api/beds` - List all beds
- `GET /api/beds?available=true` - List available beds
- `POST /api/beds` - Create new bed
- `GET /api/beds/[id]` - Get bed details
- `PATCH /api/beds/[id]` - Update bed
- `DELETE /api/beds/[id]` - Delete bed

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Development

### Build for Production

```bash
bun run build
# or
npm run build
```

### Start Production Server

```bash
bun start
# or
npm start
```

### Linting

```bash
bun run lint
# or
npm run lint
```

## Customization

### Adding a Database

Replace the functions in `src/lib/db.ts` with your database operations. The interface remains the same, so no other code changes are needed.

### Theming

The system uses Tailwind CSS with CSS variables for theming. Customize colors in `src/app/globals.css`.

### Adding Features

The codebase follows a feature-based structure. Add new features in `src/features/` and create corresponding API routes in `src/app/api/`.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the repository.
