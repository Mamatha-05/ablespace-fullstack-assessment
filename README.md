# AbleSpace Full Stack Developer Assessment

## Overview

This project implements Part 1 of the AbleSpace Full Stack Developer (Fresher) technical assessment: a responsive Task Management System based on the supplied Figma design.

The application uses the required architecture:

```text
Next.js (App Router)
      ↓
REST API
      ↓
NestJS
      ↓
TypeORM
      ↓
SQLite
```

There is **no Supabase dependency or fallback**. All task and guest-login operations go through the NestJS backend.

## Live Demo

- **Live Application:** https://ablespace-fullstack-assessment.vercel.app/
- **GitHub Repository:** https://github.com/Mamatha-05/ablespace-fullstack-assessment
- **Backend API:** https://ablespace-backend-gt7r.onrender.com

### Deployment

- **Frontend:** Vercel
- **Backend:** Render

## Features

- Guest login through `POST /auth/guest`
- Task CRUD through NestJS REST APIs
- Kanban board with To Do, In Progress and Completed columns
- Drag-and-drop status changes with backend persistence
- List view
- Search across task title, description and labels
- Status, priority and project filters
- Create/edit task modal with validation
- Task details and delete confirmation
- Task summary counts
- Light/dark theme with persistence
- Responsive desktop, tablet and mobile layouts
- Loading, error and empty states
- Toast feedback for mutations

## Tech Stack

### Frontend
- Next.js 13 App Router
- TypeScript
- Tailwind CSS
- Radix/shadcn-style UI components
- next-themes

### Backend
- NestJS 10
- TypeScript
- TypeORM
- SQLite
- class-validator

## Project Structure

```text
ablespace-fullstack-assessment/
├── app/
├── components/
├── hooks/
├── lib/
├── backend/
│   └── src/
│       ├── auth/
│       └── tasks/
├── Part-2/
├── README.md
├── ASSESSMENT_CHECKLIST.md
├── .env.example
└── .gitignore
```

## Run Locally

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend runs on `http://localhost:3001`. SQLite is created automatically and demo tasks are seeded on first startup.

### 2. Frontend

From the project root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment

The frontend defaults to `http://localhost:3001` during local development, so no frontend environment file is required for the standard local setup. You may still create `.env.local` to override the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For the backend, copy `backend/.env.example` to `backend/.env` if you want to customize the port or database path.

Do not commit `.env` or `.env.local`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/guest` | Create a guest session |
| GET | `/tasks` | List tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## Database

SQLite is used for simple local evaluation. TypeORM creates the schema automatically and seeds demo tasks when the database is empty.

## Theme

The light/dark theme selection is persisted in browser storage and survives refreshes.

## Responsive Design

The UI adapts to desktop, tablet and mobile sizes. Desktop uses the sidebar and board layout; smaller screens use responsive navigation and stacked task content.

## Validation and Error Handling

The NestJS backend uses `ValidationPipe`, DTO validation, HTTP exceptions and CORS. The frontend displays loading, empty and error states instead of silently failing.

## Part 2

`Part-2/README.md` is intentionally a placeholder. Part 2 requires manually exploring the actual AbleSpace Caseload → Take Data screen and submitting screenshots or a walkthrough plus UX/UI observations. No product behavior or screenshots have been fabricated.

## Figma Deviations

The supplied Figma is the visual reference. Where an exact icon/illustration asset is unavailable in the project, the implementation uses a close UI equivalent. Any known intentional differences should be recorded here before submission.

## Build Verification

Frontend:

```bash
npm run typecheck
npm run build
```

Backend:

```bash
cd backend
npm run build
```

Both builds should complete without TypeScript or compilation errors before submission.

## Local troubleshooting

If the Guest Login button does not move past the welcome screen, make sure the NestJS
backend is running first:

```bash
cd backend
npm install
npm run start:dev
```

Then run the frontend from the project root:

```bash
npm install
npm run dev
```

The frontend uses `http://localhost:3001` by default in development and sends
`POST /auth/guest` to the NestJS backend. CORS is configured for both
`http://localhost:3000` and `http://127.0.0.1:3000`.
