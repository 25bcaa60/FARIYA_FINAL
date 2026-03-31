require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, saveContactMessage } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const portfolioProjects = [
  {
    title: 'Nebula Commerce',
    description: 'A premium e-commerce experience with cinematic transitions, real-time stock flow, and elevated conversion design.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    accent: 'Aurora'
  },
  {
    title: 'Pulse Analytics',
    description: 'A sleek data dashboard that turns live insights into beautiful visual stories for modern brands.',
    tags: ['APIs', 'Charts', 'UX Motion'],
    accent: 'Quantum'
  },
  {
    title: 'Orbit Studio',
    description: 'A futuristic creator platform built for teams who want elegant workflows, speed, and clarity.',
    tags: ['UI Systems', 'Express', 'Neon DB'],
    accent: 'Nova'
  }
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dbConfigured: Boolean(process.env.DATABASE_URL)
  });
});

app.get('/api/projects', (req, res) => {
  res.json(portfolioProjects);
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all fields before submitting.' });
  }

  try {
    const submission = await saveContactMessage({ name, email, message });

    return res.status(201).json({
      message: 'Message sent successfully and saved to Neon DB.',
      submission
    });
  } catch (error) {
    console.error('Contact save error:', error.message);

    return res.status(500).json({
      message: error.message.includes('DATABASE_URL')
        ? 'Add your Neon DATABASE_URL in the .env file to enable message saving.'
        : 'Something went wrong while saving your message.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
  const dbReady = await initDB();
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    dbReady
      ? 'Neon database connected. Contact form submissions will be stored.'
      : 'Neon database not configured yet. Update .env with your DATABASE_URL.'
  );
});