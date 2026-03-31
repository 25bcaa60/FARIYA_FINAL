require('dotenv').config();

const { neon, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

let sqlClient = null;

async function initDB() {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  try {
    sqlClient = neon(process.env.DATABASE_URL);

    await sqlClient`
      CREATE TABLE IF NOT EXISTS portfolio_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    return true;
  } catch (error) {
    console.error('Neon initialization failed:', error.message);
    return false;
  }
}

async function saveContactMessage({ name, email, message }) {
  if (!sqlClient) {
    const ready = await initDB();
    if (!ready) {
      throw new Error('DATABASE_URL missing. Configure your Neon connection string first.');
    }
  }

  const [savedRow] = await sqlClient`
    INSERT INTO portfolio_messages (name, email, message)
    VALUES (${name}, ${email}, ${message})
    RETURNING id, name, email, message, created_at;
  `;

  return savedRow;
}

module.exports = {
  initDB,
  saveContactMessage
};