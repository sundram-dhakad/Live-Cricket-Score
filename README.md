# Live Cricket Score App

[Live Link : Cric45](https://cric45.vercel.app/)

Live cricket match dashboard built with React + Vite. The app fetches current match data from CricAPI and renders responsive score cards.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the sample:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Add your CricAPI key in `.env`:

```env
VITE_CRICAPI_KEY=your_cricapi_key_here
```

## Scripts

- `npm run dev`: Start local development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.
- `npm run lint`: Run ESLint checks.

## Current Improvements

- Loading, empty, and error UI states for API fetches.
- Retry action for failed requests.
- Safer rendering when score data is partially missing.
- Cleaner component structure and styling with responsive layout.
