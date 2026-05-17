export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload } = req.body || {};

    if (!payload || !payload.contents) {
      return res.status(400).json({
        error: 'Missing or invalid `payload`'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY not configured on server'
      });
    }

    // ✅ Stable model (supports vision + JSON output)
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({
        error: 'Gemini API error',
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy failure:', error);
    return res.status(502).json({
      error: 'Failed to reach Gemini API',
      details: String(error)
    });
  }
}