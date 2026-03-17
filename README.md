# DuneAI

Structured project layout for the DuneAI marketing site and contact-form backend.

## Project Structure

```text
.
├── backend/         # Express API, email templates, deployment config
├── components/      # Reusable frontend section/source files
├── data/            # Frontend data files
├── js/              # Browser-side JavaScript
├── styles/          # Frontend styles
├── index.html       # Main static site entrypoint
├── render.yaml      # Render backend deployment blueprint
└── README.md
```

## Frontend

- Entry file: `index.html`
- API connector: `js/api.js`
- Component source files: `components/`
- Shared styles: `styles/globals.css`
- Data: `data/projects.js`

## Backend

- Entry file: `backend/server.js`
- Package manifest: `backend/package.json`
- Environment template: `backend/.env.example`
- Render env import file: `backend/render.env` (local only, gitignored)

## Local Development

Frontend:

```powershell
python -m http.server 8080
```

Backend:

```powershell
cd backend
npm install
npm start
```

## Deployment

- Frontend: static hosting / GitHub Pages
- Backend: Render using `render.yaml`
