# Summatif UASA Mission

## Current status
- Project is a static HTML page in `PBSUMATIF.html`.
- GitHub remote exists: `https://github.com/azhandendi-sketch/summatif.git`.
- `index.html` now redirects to `PBSUMATIF.html` so GitHub Pages can serve the site from the root.
- A simple Node backend has been added to proxy Gemini requests safely.

## Secure API key setup
This project now keeps the Gemini API key on the server side in a `.env` file instead of inside browser JavaScript.

### Files added
- `server.js` — Node/Express backend proxy for Gemini.
- `package.json` — Node package manifest.
- `.gitignore` — ignores `node_modules/` and `.env`.
- `.env.example` — example environment file.

### Setup steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your local environment file:
   ```bash
   copy .env.example .env
   ```
3. Open `.env` and set your Gemini key:
   ```text
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open the page in your browser:
   `http://localhost:3000`

## How it works
- The frontend now calls `/api/gemini` instead of embedding the API key in `PBSUMATIF.html`.
- `server.js` forwards the request to the Gemini API using `process.env.GEMINI_API_KEY`.
- `.env` is ignored by Git so the key does not get committed.

## GitHub Pages note
GitHub Pages can only host static sites. It cannot run the Node backend.

If you want the static activity on GitHub Pages, keep using `index.html` and `PBSUMATIF.html` for publishing.

If you want AI grading with the secure backend, deploy `server.js` on a node-capable host such as:
- Railway
- Render
- Vercel (serverless functions)
- Fly.io
- Google Cloud Run

## Google Cloud Run deployment
This project already has a Node backend and static assets in the same folder, so Cloud Run is a good option to host both together.

### Add the Dockerfile
A `Dockerfile` is included in the repo. It builds the app and serves the static files from `server.js`.

### Deploy steps
1. Install and authenticate the Google Cloud SDK.
2. Set your project and region:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   gcloud config set run/region YOUR_REGION
   ```
3. Build and deploy:
   ```bash
   gcloud run deploy summatif-app \
     --source . \
     --platform managed \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Visit the URL printed by Cloud Run.

### Using Cloud Run environment variables safely
- Do NOT put the API key into source files.
- Do NOT commit `.env`.
- Use `--set-env-vars GEMINI_API_KEY=...` during deploy, or configure the variable in the Cloud Run console.

### If you prefer GitHub Pages + Cloud Run
- Keep the front-end static on GitHub Pages using `index.html` and `PBSUMATIF.html`.
- Deploy only the backend to Cloud Run and update the front-end API URL from `/api/gemini` to the Cloud Run service URL.

## Recommended low-cost path
- For a single deployment, use Cloud Run for both front-end and backend.
- For a free-ish static page, use GitHub Pages and reserve Cloud Run only for the AI proxy.
- Keep the Gemini API key as a Cloud Run environment variable or secret, not in the repo.
