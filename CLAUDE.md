# CLAUDE.md — CodeCamp Project Skills

Place this file at the root of the project.
Claude Code reads it automatically on every session.
All rules below are active for every task in this project.

---

## AGENT WORKFLOW (awsem-skills)

Every task follows this order. No skipping.

1. Analyze architecture first.
2. Break into modules.
3. Separate frontend/backend concerns.
4. Identify dependencies.
5. Plan implementation.
6. Build incrementally.
7. Validate functionality.
8. Refactor for maintainability.

Rules:
- Keep solutions modular.
- Prefer maintainable architecture.
- Avoid unnecessary complexity.
- Reuse components and utilities.
- Preserve existing UI unless redesign is requested.
- Prioritize production-ready solutions.
- Optimize for readability and scalability.
- Minimize token usage when possible.

---

## ARCHITECTURE

- Layered backend: `routes → controllers → services → repositories`.
- One Prisma client singleton in `src/lib/db.ts`.
- All Claude API calls in `src/lib/ai.ts` only.
- All Piston calls in `src/lib/piston.ts` only.
- No scattered `fetch` to third parties outside `src/lib/`.
- No file over ~250 lines. Split by concern.
- No `any` in TypeScript. Type everything.
- Environment variables for all secrets. Never hardcoded.
- Centralized error handling. No silent failures.
- Async/await only. No `.then()` chains.

---

## FRONTEND (front-end + frontend-design)

Before every component or page, define:
- **Purpose**: what problem this solves, who uses it.
- **Tone**: pick a clear aesthetic direction and commit.
- **Differentiation**: what makes this memorable.

Rules:
- Production-grade and functional.
- Visually striking and cohesive.
- Every detail intentional.
- Use CSS variables (`--primary`, `--background`, etc.) always. No raw hex.
- Avoid: Inter, Roboto, Arial, system-ui as primary font. Use distinctive type.
- Avoid: purple gradients on white. Avoid generic AI aesthetics.
- Avoid: predictable layouts and cookie-cutter patterns.
- Responsive by default. Mobile-first.
- Accessible: ARIA labels, keyboard navigation, sufficient contrast.

Spatial composition:
- Unexpected layouts, asymmetry, overlap where appropriate.
- Generous negative space OR controlled density. Never both randomly.
- Vary spacing for rhythm. Same padding everywhere is monotony.
- Cards only when they're the best affordance. Nested cards are always wrong.

Typography:
- Pair a distinctive display font with a refined body font.
- Cap body line length at 65–75ch.
- Hierarchy via scale + weight contrast (≥1.25 ratio between steps).

Color:
- Use OKLCH when writing raw color values.
- Never `#000` or `#fff`. Tint every neutral toward brand hue.
- Choose a color strategy before picking colors:
  - **Restrained**: tinted neutrals + one accent ≤10%
  - **Committed**: one saturated color carries 30–60%
  - **Full palette**: 3–4 named roles, used deliberately

Dark vs light:
- Not a default. Write one sentence: who uses this, where, in what light.
- If the sentence doesn't force the answer, add detail until it does.

Background:
- Avoid solid color defaults. Create atmosphere.
- Use: gradient meshes, noise textures, geometric patterns, layered transparencies.
- The animated hero (`background-paths.tsx`) is the landing background.

---

## DESIGN POLISH (impeccable + emil-design-eng)

Absolute bans:
- No side-stripe borders (`border-left` or `border-right` > 1px as colored accent on cards).
- No `transition: all`. Specify exact properties.
- No `transform: scale(0)` alone. Pair with `opacity: 0`.
- No `ease-in` on appearing elements. Feels sluggish.
- No animation on keyboard-triggered actions (repeated hundreds of times/day).

Required details:
- Every button needs an `:active` state (`transform: scale(0.97)`).
- Popovers scale from trigger origin, not center.
- Modals stay centered.
- Toasts enter and exit from the same direction.

Animation decision before every animation:

1. How often will the user see this?
   - 100+/day → no animation.
   - Tens/day → remove or minimize.
   - Occasional → standard animation.
   - Rare → delight allowed.

2. What is the purpose? Must be one of:
   - Spatial consistency, state indication, explanation, feedback, preventing jarring changes.
   - If purpose is only "looks cool" and it's seen often → don't animate.

3. Easing:
   - Entering/exiting → `ease-out` (starts fast, responsive feel).
   - Moving on-screen → `ease-in-out`.
   - Spring physics for popovers, drawers, interactive elements.

Code review format (when reviewing UI):
Always output a markdown table with Before / After / Why columns.

---

## ANIMATION (motion-framer)

Use `motion` (framer-motion v11+). Import: `import { motion, AnimatePresence } from "motion/react"`.

Core patterns:
- Wrap HTML elements: `<motion.div>`, `<motion.button>`.
- Use `variants` for shared animation sets across components.
- Use `AnimatePresence` for any element that conditionally mounts/unmounts.
- Use `layout` prop for animated layout changes.
- Use `whileHover`, `whileTap`, `whileDrag` for gestures.
- Use `useMotionValue` + `useTransform` for scroll-based effects.
- Use spring physics (`type: "spring", stiffness, damping`) for interactive elements.

Stagger pattern for list reveals:
```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
```

Page transitions: wrap route content in `AnimatePresence mode="wait"`.

---

## BACKEND (nodejs-backend)

Next.js API routes follow this pattern per route:
- Parse + validate input with `zod`.
- Call service layer. Route handler contains no business logic.
- Return typed JSON response.
- Centralized error handler catches and formats all errors.

Auth:
- Passwords hashed with `bcryptjs` (12 rounds).
- Sessions via NextAuth. Never trust client-sent user IDs.
- Protect routes with session checks server-side.

Middleware applied to all API routes:
- Input validation (zod).
- Rate limiting (especially run-code, ai/tutor, ai/quiz-feedback).
- Error boundary.

Database:
- Normalized schemas. No denormalization without documented reason.
- Index all foreign keys and frequently queried columns.
- Use `select` to return only needed fields. Never return password hashes.
- Use transactions for multi-step writes.

---

## AI INTEGRATION (lib/ai.ts only)

All Claude calls live in `src/lib/ai.ts`. Nowhere else.

AI Tutor rules:
- System prompt includes: lesson title, lesson markdown, user's current code, exercise goal.
- Nudge, don't solve. Never paste the full solution.
- Strip prompt-injection patterns before sending (`src/lib/sanitize.ts`).
- Stream responses. Handle timeout gracefully.

AI Quiz Feedback rules:
- Server computes score deterministically. AI feedback is additive only.
- AI never changes pass/fail result.
- Output structured JSON: per-question note, overall summary, suggested review topics.

Sanitize before every AI call:
- Remove: "ignore previous instructions", "you are now", "disregard", system-override patterns.
- Truncate user content at safe token limit.

---

## SECURITY (secuartit)

Always:
- Validate all input with zod. Never trust client data.
- Sanitize before DB writes and AI calls.
- Use parameterized queries (Prisma handles this — never raw string interpolation).
- HTTPS assumptions on all external calls.
- Protect secrets with env variables only.
- Re-grade quizzes server-side. Never trust client-sent scores.
- Rate-limit: code execution, AI endpoints, auth routes.
- RBAC: users only access their own progress/data.

Never:
- Return stack traces in production responses.
- Log sensitive data (passwords, tokens).
- Store secrets in code or client bundles.
- Allow unrestricted file uploads or code execution outside Piston sandbox.

OWASP Top 10 checklist before shipping:
- [ ] Injection (SQL, prompt, command) — mitigated.
- [ ] Broken auth — sessions validated server-side.
- [ ] Sensitive data exposure — no secrets in client.
- [ ] XSS — React escapes by default; dangerouslySetInnerHTML banned.
- [ ] Broken access control — every API route checks session.
- [ ] Security misconfiguration — env vars for all config.

---

## DEVOPS (devops)

Docker:
- Multi-stage Dockerfile (builder + production).
- Non-root user in production image.
- Health check endpoint at `/api/health`.

Environment:
- Required vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `ANTHROPIC_API_KEY`.
- `.env.example` must be kept in sync with required vars.
- Never commit `.env`.

CI/CD (GitHub Actions):
- On PR: lint, typecheck, build.
- On merge to main: `npx prisma db push && npx prisma db seed`, deploy to Vercel.

Deploy checklist before every phase ship:
- [ ] `npm run build` passes.
- [ ] `npm run typecheck` passes.
- [ ] Seed runs idempotently.
- [ ] No secrets in client bundle (`NEXT_PUBLIC_` vars are public).
- [ ] API routes have auth + zod guards.

---

## COMMUNICATION

- Report phase completion with: what was built, how to run it, next phase.
- Flag architecture issues immediately — don't silently work around them.
- If a design decision has tradeoffs, state them briefly.
- No motivational language. No filler. Direct and technical.
