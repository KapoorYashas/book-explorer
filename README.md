# Movie Explorer App

A modern, responsive React + TypeScript web application for discovering movies, searching the OMDb API, exploring detailed metadata, and managing per-user favorites backed by Firebase Authentication and Cloud Firestore.

Built adhering to **MVVM (Model-View-ViewModel)** architectural principles, accessible design standards (WCAG AAA contrast), and responsive styling.

**Live Demo**: _[link coming after deployment]_

---

## 🚀 Tech Stack

* **Core Framework**: React 19 + TypeScript + Vite
* **Routing**: React Router v7 (with route-based code splitting via `React.lazy` and `<Suspense>`)
* **Data Sources**: OMDb API (Movie Data & Search)
* **Backend Services**: Firebase Authentication (Email/Password) & Cloud Firestore (Per-User Real-Time Favorites)
* **UI & Styling**: Vanilla CSS with CSS Custom Properties (Blue-Slate palette: `#27374D`, `#526D82`, `#9DB2BF`, `#DDE6ED`)
* **Icons**: Lucide React

---

## 🏛️ Architecture (MVVM Pattern)

The application follows a strict **MVVM (Model-View-ViewModel)** architecture to guarantee clean separation of concerns, testability, and decoupled UI logic:

```
src/
├── models/        # [MODEL] Domain interfaces & raw API response shapes (Movie.ts, User.ts, OMDb.ts)
├── services/      # [MODEL] External API, Auth & Firestore data access (MovieService.ts, AuthService.ts, FavoriteService.ts)
├── context/       # [VIEWMODEL] App-wide state providers (AuthContext.tsx, FavoritesContext.tsx)
├── viewmodels/    # [VIEWMODEL] Custom React hooks containing logic & state (useMovies.ts, useAuth.ts, useFavorites.ts)
└── views/         # [VIEW] Presentational components & route-level pages (SearchPage, MovieDetailsPage, MovieCard, etc.)
```

### Layer Breakdown

1. **Model (Data Layer)**: Represents domain objects (`Movie`, `User`) and service layers (`MovieService`, `AuthService`, `FavoriteService`) handling HTTP requests and Firestore CRUD queries.
2. **ViewModel (Logic Layer)**: Custom React hooks (`useMovies`, `useAuth`, `useFavorites`, `useMovieDetails`) and Context Providers managing state, async operations, optimistic UI updates, and client-side form validations.
3. **View (Presentation Layer)**: Pure React presentation components (`MovieCard`, `Navbar`, `SearchBar`, `Button`, `Loading`, `Error`) and route-level pages (`SearchPage`, `MovieDetailsPage`, `LoginPage`, `RegisterPage`, `FavoritesPage`).

---

## ✨ Features

* **Dynamic Landing Page**: Automatically selects a randomized genre keyword (`action`, `comedy`, `adventure`, `thriller`, `animation`, `drama`, `fantasy`, `fiction`) on each load to showcase featured titles.
* **Movie Search**: Fast movie title search against the OMDb API with loading, error, and empty states.
* **Movie Details**: Rich movie details view displaying poster image, title, release year, runtime, IMDb rating, genre, plot summary, director, and cast list.
* **Poster Fallbacks**: Graceful fallback handling for 404 images or missing posters (`"N/A"`).
* **Firebase Authentication**: Email/Password sign-up and login with client-side validation, friendly error formatting (no raw Firebase codes), and session persistence.
* **Per-User Favorites**: Favorites stored in Cloud Firestore, isolated per authenticated user UID with real-time snapshot synchronization and optimistic UI updates.
* **Accessibility (a11y)**: Compliant with WCAG AAA color contrast ratios (`7.6:1`), keyboard focus rings (`:focus-visible`), ARIA live regions (`role="status"`, `role="alert"`), and valid HTML semantics (no nested interactive controls).

---

## 🛠️ Installation & Local Setup

### Prerequisites

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **OMDb API Key**: Free API key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx)
* **Firebase Project**: Firebase console project with **Authentication (Email/Password)** and **Firestore Database** enabled.

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/KapoorYashas/book-explorer.git
cd book-explorer
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root directory and populate it with your OMDb and Firebase configuration keys:

```env
# OMDb API Key
VITE_OMDB_API_KEY=your_omdb_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

> **Note**: `.env.local` is gitignored via `*.local` in `.gitignore` to prevent committing secret keys.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Directory & Folder Structure

```
book-explorer/
├── public/                 # Static assets
├── src/
│   ├── config/             # Application constants & configuration (constants.ts)
│   ├── context/             # Auth & Favorites Context providers
│   ├── models/              # Domain TypeScript interfaces (Movie.ts, User.ts, OMDb.ts)
│   ├── services/            # External API & Firebase service implementations
│   ├── viewmodels/          # React ViewModel hooks (useMovies, useAuth, useFavorites, etc.)
│   ├── views/
│   │   ├── components/      # Reusable presentational components (Navbar, MovieCard, SearchBar, etc.)
│   │   └── pages/           # Route-level page components (SearchPage, MovieDetailsPage, etc.)
│   ├── App.tsx              # Root component with Providers & React Router configuration
│   ├── index.css            # Global Design System, CSS variables, & responsive styling
│   └── main.tsx              # Application entry point
├── .env.local               # Local environment variables (gitignored)
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── package.json             # Project dependencies & npm scripts
```

---

## 🤖 AI-Assisted Development Workflow

This application was developed using an AI-assisted pair-programming workflow structured across progressive milestones:

1. **Staged Architecture**: Incremental feature implementation with human review and Git commits after every stage.
2. **Strict Verification**: Every stage verified through manual testing, and — where relevant — build compilation and accessibility auditing.

*(A detailed report documenting prompt logs, architectural decisions, and manual code corrections is provided separately as part of the assignment submission — see `AI_USAGE_REPORT.md` and `MANUAL_IMPROVEMENTS.md`.)*

---

## ⚠️ Known Limitations

1. **OMDb API Data Quality**: Some movies in OMDb lack poster images or return `"N/A"` / broken links. The app handles this with automatic image error fallbacks.
2. **OMDb Page Limit**: OMDb's search endpoint returns 10 results per page request.
3. **Safari Firestore Web Channel Notice**: In some Safari desktop versions, the Firestore SDK emits a benign long-polling web channel notice in the developer console when WebSockets are unavailable — this does not affect functionality.
4. **OMDb Free Tier is HTTP-only**: The free OMDb API key serves requests over HTTP, not HTTPS, which is fine for local development.

---

## 🔮 Future Improvements

* **Multi-Page Pagination**: Add next/previous page controls for search results.
* **Genre & Year Filter Controls**: Add dropdown filters to narrow down search queries by release year or genre.
* **User Ratings & Notes**: Allow authenticated users to add custom ratings and personal notes to favorited movies.
* **Dark / Light Theme Toggle**: Introduce a user-configurable light/dark color scheme.