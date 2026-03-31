# Futuristic Portfolio

A full-stack portfolio website with:

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** Neon PostgreSQL

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from `.env.example`
3. Add your Neon database connection string to `DATABASE_URL`
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`

## Features

- Futuristic dark UI with glowing accents
- Responsive single-page portfolio layout
- Dynamic project cards from a Node.js API
- Contact form that stores submissions in Neon DB

## Deploy on Render

1. Push this project to a GitHub repository.
2. In Render, click **New +** → **Web Service**.
3. Connect the GitHub repo.
4. Render will detect `render.yaml` automatically.
5. In the Render environment variables, add:
   - `DATABASE_URL` = your Neon connection string
6. Deploy the service.

### Production settings

- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`

## Important

The backend automatically creates the `portfolio_messages` table when `DATABASE_URL` is configured.
