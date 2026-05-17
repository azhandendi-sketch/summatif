import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const geminiKey = process.env.GEMINI_API_KEY;

app.use(express.json({ limit: '12mb' }));
app.use(express.static(path.join(process.cwd())));

app.post('/api/gemini', async (req, res) => {
  if (!geminiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing payload in request body.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Gemini proxy error:', error);
    res.status(500).json({ error: 'Gemini proxy request failed.', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
  console.log('Use CTRL+C to stop the server.');
});
