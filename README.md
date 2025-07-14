# 12222211

**Live Demo:** [https://melodious-centaur-b94a98.netlify.app/](https://melodious-centaur-b94a98.netlify.app/)

## React URL Shortener

A user-friendly URL Shortener application built with React and Material UI. The app allows you to shorten URLs, set custom shortcodes and expiry, and view analytics for each link—all managed on the client side.

### Features
- Shorten up to 5 URLs at once
- Custom or auto-generated shortcodes (guaranteed unique)
- Set expiry time for each short URL (default: 30 minutes)
- Client-side validation and error handling
- Analytics: track number of redirects per short URL
- Statistics page: view all created short URLs, expiry, and usage count
- Material UI for a clean, modern interface

### Getting Started

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the app:**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

### Project Structure
- `frontend/` — Main React app
  - `src/pages/ShortenerPage.js` — Main URL shortener UI
  - `src/pages/StatisticsPage.js` — Analytics/statistics page
  - `src/pages/RedirectPage.js` — Handles short URL redirection
  - `src/utils/loggingMiddleware.js` — Custom logging middleware

### Notes
- All data is stored in your browser (localStorage). No backend required.
- Only Material UI and native CSS are used for styling.

---

Feel free to fork, clone, and extend this project!
