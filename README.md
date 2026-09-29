# HostelHub

HostelHub is a comprehensive web application designed for hostel residents to manage everyday resources, report issues, and build a connected community. From booking laundry machines to finding lost items, HostelHub centralizes hostel life into a single, seamless digital experience.

## Features

This section accurately documents the **current implementation state** of the application.

✅ **Authentication**
- Email/password signup and login.
- Google OAuth integration.
- Secure, auth-protected routes using Supabase middleware.
- Dedicated user onboarding flow to select hostel and floor.
- Password reset and recovery flow.

✅ **Dashboard**
- Personalized greeting and overview based on the resident's hostel and floor.
- Real-time status cards for Laundry, Water Purifier, and Wi-Fi.
- Quick view of recent Announcements and Community Needs.

✅ **Laundry Module (Fully Functional Demo)**
- Configured for Ramanujan Hostel (Floors 1-10, exactly one machine per floor).
- Dynamic real-time statuses: 🟢 AVAILABLE, 🟡 IN USE, 🔴 NOT WORKING.
- Booking flow with 30, 45, or 60-minute duration selection and optional laundry notes.
- Automatic availability resets when the expected finish time expires.
- Privacy-first display (shows only the user's name when a machine is booked, no sensitive data).
- Integrated problem reporting that instantly updates the machine status to "Not Working" and files a maintenance ticket.
- *Self-healing database routine*: Automatically ensures exactly 1 machine per floor exists upon page load.

✅ **Maintenance**
- Residents can report issues (plumbing, electrical, Wi-Fi, etc.) with priority levels.
- View all reported issues for the hostel and their current resolution status.

✅ **I Need / I Have**
- A marketplace for residents to request items (e.g., a calculator) or offer items to lend.
- Create new posts and view active requests.

✅ **Lost & Found**
- Report lost items or announce found items to the entire hostel.

🚧 **In Progress / Basic Implementations**
The following modules have implemented UI and route structures but may lack deep backend integrations or complex features:
- **Announcements**: View official notices.
- **Community**: Basic community posting.
- **Water Purifier**: View water purifier status.
- **Wi-Fi**: Check current floor network status.
- **Notifications**: Read and mark notifications as read.
- **Emergency**: Quick access to emergency contacts.
- **Resident Profile**: Basic profile view.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | Core web application framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Rapid utility-first styling |
| **Supabase** | Authentication, PostgreSQL Database, and RLS Security |
| **shadcn/ui & Base UI** | Accessible UI component architecture |
| **Lucide React** | Consistent iconography |
| **React Hook Form + Zod** | Form handling and validation |

## Project Structure

```text
hostelhub/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (pages and layouts)
│   │   ├── (auth)/         # Auth routes (login, signup, reset)
│   │   ├── actions/        # Next.js Server Actions (database mutations)
│   │   ├── dashboard/      # Main dashboard view
│   │   ├── laundry/        # Laundry booking module
│   │   ├── maintenance/    # Issue reporting module
│   │   └── ...             # Other feature routes
│   ├── components/         # Reusable UI components (shadcn, custom)
│   └── lib/                # Utility functions and Supabase clients
├── supabase/
│   ├── migrations/         # PostgreSQL schema and RLS policies
│   └── seed.sql            # Demo data for testing
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

## Routes

**Currently Existing Routes:**
- `/login`
- `/signup`
- `/onboarding`
- `/forgot-password`
- `/reset-password`
- `/auth/callback` (OAuth handling)
- `/dashboard`
- `/laundry`
- `/maintenance`
- `/need-have`
- `/lost-found`
- `/water`
- `/wifi`
- `/announcements`
- `/community`
- `/notifications`
- `/emergency`
- `/profile`

## Supabase Integration

HostelHub relies heavily on Supabase for both backend data and identity management:
- **Authentication**: Handles user sessions, JWTs, and OAuth.
- **PostgreSQL Database**: Stores all application state.

**Key Tables Used:**
- `profiles`: Extends the Auth user with hostel and floor assignments.
- `hostels` & `floors`: Defines the physical structure of the campus.
- `washing_machines`: Tracks machine statuses, active bookings, and expected finish times.
- `maintenance_issues`: Stores reported problems linked to users, hostels, and optionally specific machines/floors.
- `need_have_posts` & `lost_found_items`: Community interaction tables.

### Database Relationships

```text
User (Auth)
  ↓
Profile
  ↓
Hostel → Floors → Washing Machines
  ↓
Maintenance Issues
```

## Environment Variables

HostelHub requires the following environment variables to connect to Supabase.

*Note: Never commit `.env.local` to version control, and never expose Supabase service-role keys in client-side code.*

Create a `.env.local` file (or copy `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development

Follow these exact steps to run the project locally.

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hostelhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   Navigate to [http://localhost:3000](http://localhost:3000)

**Available Commands:**
- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

## Supabase Setup

To set up a fresh Supabase instance for this project:

1. **Create a Supabase Project** via the Supabase dashboard.
2. **Apply Database Schema**: Run the SQL files found in `supabase/migrations/` sequentially in the Supabase SQL Editor to create all required tables, enums, and triggers.
3. **Seed Data**: Run `supabase/seed.sql` to populate the database with Ramanujan Hostel, 10 floors, and demo profiles/data.
4. **Configure Authentication**: Ensure Email Auth is enabled.
5. **Configure Redirect URLs**: Under *Authentication > URL Configuration*, add `http://localhost:3000/auth/callback` to your Site URL or Redirect URLs.

## Google OAuth

Google OAuth is fully integrated into the code via the login/signup pages. To make it work in your environment:

1. Go to **Google Cloud Console**, create OAuth credentials, and set the authorized redirect URI to:
   `https://<your-supabase-project>.supabase.co/auth/v1/callback`
2. Go to **Supabase Dashboard > Authentication > Providers > Google**.
3. Enable Google and paste your Client ID and Client Secret from Google Cloud.
4. The application code handles the rest by redirecting to `/auth/callback` upon success.

## Deployment on Vercel

1. Push your project to a GitHub repository.
2. Go to Vercel and import the repository.
3. Vercel will automatically detect Next.js.
4. Add the required Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. **Important**: Copy your new Vercel production URL (e.g., `https://hostelhub-xyz.vercel.app`).
7. Update Supabase Authentication: Add the Vercel URL to your Supabase Redirect URLs so auth callbacks return to the live site instead of localhost.

## Security

- **Environment Variables**: `.env.local` is ignored by Git. Only safe, public anonymous keys are used in the client.
- **Protected Routes**: Next.js Server Actions and Middleware strictly enforce authentication. Unauthenticated users are redirected to `/login`.
- **Row Level Security (RLS)**: Must be enabled on Supabase tables to ensure users can only modify their own data (e.g., cancelling their own laundry bookings).

## Development Workflow

1. Start coding with `npm run dev`.
2. Before pushing to GitHub, always ensure the build succeeds:
   ```bash
   npm run build
   ```
3. Test any database or schema changes directly in your Supabase project before writing application code for it.

## Current Status

- **Authentication**: Fully implemented (Email/Password, Google OAuth, Onboarding).
- **Dashboard**: Fully functional with real-time data fetching.
- **Laundry**: 100% complete with complex state management, self-healing database scripts, booking logic, and maintenance integrations.
- **Maintenance / Needs / Lost & Found**: Fully functional basic CRUD operations.
- **Other Modules**: UI implemented, backend logic in progress.
- **Production Deployment**: Vercel ready.

### Known Limitations

- Some modules (like Wi-Fi or Water) may have a fully working UI but are not yet deeply integrated with complex backend monitoring scripts.
- Google OAuth requires you to manually configure your Google Cloud Console; it does not work out-of-the-box without your own keys.
- Administrative workflows (e.g., an Admin panel to resolve maintenance tickets) are not yet built; resolution currently requires direct database updates.

## Demo / Hackathon Setup

This prototype is currently configured specifically for **Ramanujan Hostel**:
- The database is seeded with **Floors 1 through 10**.
- The Laundry module expects exactly **1 washing machine per floor**. (If the database is empty or corrupt, the `/laundry` route will automatically self-heal and insert exactly 1 machine per floor).

## Contributing

1. Create a feature branch (`git checkout -b feature/my-feature`).
2. Make your changes and test locally.
3. Run `npm run build` and `npm run lint`.
4. Commit your changes.
5. Open a Pull Request.

## License

License: Not specified.

