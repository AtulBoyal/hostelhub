# HostelHub 🏫

HostelHub is a modern, student-focused digital hub designed to streamline everyday hostel life at IITH (Indian Institute of Technology Hyderabad). Built for both students and hostel staff, it centralizes utility tracking, community sharing, maintenance reporting, and emergency resources into a single, polished, blazing-fast application.

## ✨ Features

- **📊 Dashboard**: A personalized daily overview of your hostel's live status, including laundry availability, unread announcements, and active maintenance issues.
- **🧺 Laundry Management**: Real-time tracking of washing machine availability per floor. Book machines, report problems, and cancel bookings.
- **🛠️ Maintenance**: A professional issue-tracking system for students to report broken fixtures, plumbing leaks, and electrical faults.
- **💧 Water & 📶 Wi-Fi**: Live status indicators for floor-by-floor water purifiers and network connectivity, ensuring transparent utility management.
- **📢 Announcements**: A digital notice board for important hostel updates and urgent broadcasts from administration.
- **🤝 Community Space**:
  - **I Need / I Have**: A peer-to-peer sharing board for borrowing chargers, textbooks, or umbrellas.
  - **Lost & Found**: Quickly recover misplaced items around the hostel.
  - **Community Forum**: A friendly space for general hostel discussions and questions.
- **🚨 Emergency**: Immediate access to crucial campus contacts (Medical, Security, Warden) with one-tap dialing.
- **🔔 Smart Notifications**: A personal inbox for updates on your maintenance tickets, laundry bookings, and community posts.

## 🚀 Tech Stack

HostelHub is built using a state-of-the-art modern web stack, prioritizing performance, user experience, and developer velocity.

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom design system heavily utilizing [shadcn/ui](https://ui.shadcn.com/) and [Lucide React](https://lucide.dev/) icons.
- **Fonts**: `next/font` (Geist & Geist Mono)

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (Relational schema with robust Row-Level Security)
- **Authentication**: Supabase Auth (Google OAuth & Email/Password)

### Performance Optimizations
- **React Server Components (RSC)**: Zero-bundle-size data fetching.
- **Deduplicated Queries**: `React.cache()` ensures layout and pages don't execute redundant DB queries.
- **Instant Navigation**: Leverages Next.js `loading.tsx` boundaries and `<Link prefetch={true}>` for instant perceived performance without client-side data waterfalls.

## 🛠️ Local Development

Follow these steps to get HostelHub running on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A Supabase account and project.

### 2. Clone the repository
```bash
git clone https://github.com/yourusername/hostelhub.git
cd hostelhub
```

### 3. Install dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the Development Server
```bash
npm run dev
```

The application will be running at `http://localhost:3000`.

## 🗄️ Database Schema

HostelHub relies on a relational Supabase schema. Key tables include:
- `profiles`: User information, linked to their specific hostel and floor.
- `hostels` & `floors`: Organizational hierarchy.
- `washing_machines` & `purifiers`: Utility entities with live status tracking.
- `maintenance_issues`: Tickets with status enums (`reported`, `in_progress`, `resolved`).
- `community_posts` & `need_have_posts`: Forums and peer-to-peer exchanges.
- `notifications`: User-specific alerts.

*Note: The application employs Supabase Row Level Security (RLS) to ensure users can only access or modify data relevant to their hostel and permissions.*

## 🤝 Contributing

Contributions are always welcome! Whether it's a bug report, feature suggestion, or a pull request, your input helps make HostelHub better for everyone.

## 📄 License

This project is licensed under the MIT License.
