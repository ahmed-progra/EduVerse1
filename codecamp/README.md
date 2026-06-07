# AdVerse — Premium Coding Education

A premium coding education platform with structured courses, interactive coding exercises, placement exams, and gamified learning. Cyberpunk terminal UI design.

Built with Next.js 14, TypeScript, Prisma (PostgreSQL), Tailwind CSS v4, and Claude AI.

## Features

- **Structured Courses** — HTML & CSS, JavaScript, Python, C++ with beginner/intermediate/advanced paths
- **Interactive Lessons** — Read theory, write code in Monaco editor, run it via Judge0 API or local execution
- **Placement Exams** — Skill detection before each course to assign the right learning path
- **AI Tutor** — Claude-powered chat that nudges you toward the solution (never gives it away)
- **Quizzes & Exams** — Per-lesson quizzes with AI feedback; final exam with certificate on pass
- **Gamification** — XP system, levels, streaks, achievements, daily goals
- **Leaderboard** — Global ranking by completed lessons and XP
- **Authentication** — Email/password (bcrypt) and GitHub OAuth via NextAuth
- **Cyberpunk UI** — Dark terminal aesthetic with neon accents, glitch effects, scanlines, grid backgrounds
- **Dark/Light Theme** — Persistent theme toggle with Claude-warm color palette

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict, no `any`) |
| Database | SQLite via Prisma ORM |
| Auth | NextAuth v4 (Credentials + GitHub) |
| AI | Anthropic Claude (streaming tutor, quiz feedback) |
| Code Runner | Judge0 CE + local fallback |
| Editor | Monaco (VS Code) |
| Styling | Tailwind CSS v4 + CSS variables |
| Animation | Motion (framer-motion v11+) |
| UI Components | shadcn/ui + custom (GlowingShadow, ParticleButton, Dock) |
| Validation | Zod |

## Getting Started

```bash
# Install dependencies
npm install

# Run database migrations and seed
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma datasource URL (default: `file:./dev.db`) |
| `NEXTAUTH_SECRET` | Yes | Random string for session encryption |
| `NEXTAUTH_URL` | Yes | App URL (default: `http://localhost:3000`) |
| `ANTHROPIC_API_KEY` | Yes | Claude API key for AI tutor & quiz feedback |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth App client secret |
| `JUDGE0_URL` | No | Judge0 CE instance URL (default: `https://ce.judge0.com`) |
| `ANTHROPIC_MODEL` | No | Claude model ID (default: `claude-3-haiku-20240307`) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run seed` | Run database seed |

## Architecture

```
src/
├── app/            # Next.js App Router pages & API routes
│   ├── api/        # Backend: auth, courses, lessons, code, ai, certificate
│   └── courses/    # Frontend: course catalog, lesson viewer, exam, placement
├── components/     # React components
│   └── ui/         # shadcn/ui + custom components
├── lib/            # Utilities (prisma, auth, ai, judge0, validation, errors)
└── types/          # TypeScript type augmentations
```

- Layered backend: routes → services (where needed) → Prisma
- All Claude calls through `src/lib/ai.ts`
- All code execution through `src/lib/judge0.ts` (remote) + `src/lib/execution/` (local fallback)
- Zod validation on every API route
- Centralized error handling via `AppError` / `handleApiError`
- Rate limiting on auth, code execution, and AI endpoints
