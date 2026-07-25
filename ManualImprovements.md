# Manual Improvements Report — Movie Explorer App

This report lists concrete corrections, catches, and decisions made by reviewing AI-generated code rather than accepting it uncritically.

## 1. Caught an incomplete stage that was assumed done

After an earlier agent session ran out of usage and work resumed with a new agent (Antigravity CLI), a check for the favorites feature (`find src -iname "*favorite*"`) revealed that `FavoritesPage.tsx` was still a stub returning `null`, and `MovieCard.tsx` had no favorite button at all — despite the corresponding development stage having been reported as complete. This was only caught by directly inspecting the files rather than trusting the summary, and the feature had to be re-prompted and built from scratch.

**Why it mattered**: Without this check, a core assignment feature (per-user Firestore favorites) would have been silently missing from the final submission.

## 2. Diagnosed and fixed a project-wide TypeScript import error

A `SyntaxError: Importing binding name 'OMDbMovieResponse' is not found` was investigated systematically: confirmed the export existed, confirmed the import path was correct, ruled out a barrel-file naming collision, and ultimately traced it to the project's `verbatimModuleSyntax` TypeScript setting requiring `import type` for all interface imports. The fix (converting to `import type`) initially only patched one file, causing the *same class of error* to reappear on a different type (`Movie`) — this was recognized as a systemic issue and the AI was directed to fix it project-wide rather than file-by-file.

**Why it mattered**: A narrow fix would have caused the same bug to resurface repeatedly across the codebase.

## 3. Verified the OMDb "false success" edge case was actually handled

OMDb returns HTTP 200 with `Response: "False"` even for failed searches, which is a common trap (naive code checking only `response.ok` would treat failed searches as successful). Rather than assuming this was handled, the actual `MovieService.ts` code was read and the specific line (`if (data.Response === "False")`) was confirmed present before moving forward.

**Why it mattered**: This is exactly the kind of bug that passes casual testing (a successful search "works") but silently mishandles the most common failure case (misspelled or nonexistent titles).

## 4. Approved a real MVVM architecture violation fix, and verified it manually

An AI code review flagged that `useFavorites.ts` (a ViewModel) directly imported and called `useNavigate()` from React Router — a UI/routing side-effect inside a layer that should remain framework-agnostic. This fix was approved and applied (moving `useNavigate` into the View components, having the ViewModel return a boolean instead), and then manually re-tested end-to-end: logging out and clicking the favorite button on both `MovieCard` and `MovieDetailsPage` to confirm the login redirect still worked correctly after the refactor.

**Why it mattered**: This is a genuine architectural correctness fix, and re-testing after the refactor caught the specific risk that a behavior-preserving refactor could silently break the redirect flow.

## 5. Triaged an AI code review instead of applying it wholesale

Given six flagged accessibility issues and five flagged architecture/refactor suggestions across two separate review passes, each was evaluated individually rather than approved as a batch. High-value, low-risk fixes (nested `<button>` inside `<Link>` — an HTML validity violation causing keyboard/screen-reader issues; color contrast failing WCAG AA; dead code removal; magic string extraction) were approved. Lower-value or higher-risk suggestions (splitting a 987-line CSS file into modules, extracting new shared components like `AuthFormLayout`) were explicitly deferred as not worth the risk/effort given time constraints.

**Why it mattered**: Demonstrates deliberate engineering judgment rather than rubber-stamping every AI suggestion — cosmetic/organizational suggestions were weighed against functional and accessibility fixes and prioritized accordingly.

## 6. Fixed a genuine HTML nesting violation identified in accessibility review

The AI's accessibility audit caught that the favorite button was nested inside the `<Link>` (`<a>`) element in `MovieCard.tsx` — invalid HTML (interactive elements cannot nest) that also broke correct keyboard tab order and screen reader announcement. After the fix was applied, this was manually verified: clicking the favorite heart no longer triggered navigation to the movie's detail page, and the button remained keyboard-reachable via Tab.

**Why it mattered**: This was a real bug with concrete negative impact on accessibility and interaction correctness, not a stylistic nitpick, and needed hands-on verification since the fix changed both DOM structure and event handling.