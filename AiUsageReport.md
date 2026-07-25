# AI Usage Report — Movie Explorer App

This report describes how AI (via Antigravity/Cursor-style AI coding agents, guided through Claude for planning and review) assisted throughout the development of this project.

## Planning & Architecture

Development began with an AI-generated project plan before any code was written, explicitly instructing the AI *not* to generate code at that stage — only to propose features, folder structure, and an MVVM architecture (Model / ViewModel / View separation across `models/`, `services/`, `viewmodels/`, and `views/`). This "plan first, review, then code" approach was used consistently for every subsequent stage: a scoped prompt was given, the AI's output was reviewed, and only then was it committed.

The project originally started as a "Book Explorer" app using the Google Books API. After hitting a hard `RESOURCE_EXHAUSTED` quota error (the unauthenticated request quota was set to 0), a decision was made to switch data sources entirely to the OMDb API and pivot the app to a movie search tool. AI was prompted to perform this swap directly on the existing codebase — replacing models, the service layer, and renaming references — rather than rebuilding from scratch, since the MVVM structure, routing, and layout components were domain-agnostic and did not need to change.

## Implementation

AI was used stage-by-stage to implement: TypeScript models for the OMDb API response shapes, a `MovieService` handling search/detail/timeout logic, a `useMovies` ViewModel hook, the `SearchPage` and `MovieDetailsPage` views, a reusable `MovieCard` component, Firebase Authentication (email/password login and registration), and Firestore-backed per-user favorites (`FavoriteService`, `useFavorites`, `FavoritesContext`). Each stage was scoped narrowly (one feature per prompt) and followed by a manual human checkpoint before committing to Git.

## Debugging

Several real bugs were identified and resolved with AI assistance during this process:
- A `SyntaxError: Importing binding name ... is not found` error was traced to the project's TypeScript `verbatimModuleSyntax`/`isolatedModules` setting requiring `import type` for interface imports across the whole codebase, not just the file where the error first surfaced.
- A blank page on the search route was traced to `SearchPage.tsx` being a stub that had never actually been implemented, despite an earlier stage claiming it was complete.
- A broken OMDb poster image (404) was diagnosed as an upstream data quality issue rather than an application bug, and handled with a graceful fallback UI instead.
- Firestore "access control checks" console errors were identified as a known Safari-specific WebChannel long-polling limitation, confirmed by testing in a different browser, rather than a functional defect.

## Refactoring

After core features were complete, AI was prompted to act as a "Senior React Staff Engineer" and produce a full code review without making changes. The review flagged issues including a ViewModel (`useFavorites`) directly calling `useNavigate` (a router side-effect breaking MVVM separation), dead code in `useMovies`, duplicated Firestore-to-`Movie` mapping logic, and hardcoded magic strings. These were triaged deliberately — some approved and applied (the MVVM violation, dead code removal, duplication extraction, magic string constants, AuthService type safety), others explicitly deferred (CSS modularization, additional shared components) as lower-value given time constraints.

## Testing

AI generated a structured manual testing checklist covering authentication, search, movie details, per-user favorites isolation, routing, responsiveness, and accessibility. This was executed by hand, including creating two separate test user accounts to verify Firestore favorites were correctly isolated by user UID.

## Documentation

AI assisted in generating this report, the accompanying manual improvements report, and the project README, all of which were reviewed and edited to accurately reflect what was actually built and tested rather than an idealized or exaggerated account.