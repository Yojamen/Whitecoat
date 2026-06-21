// File: api/gemini.js

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key belum diatur di Vercel Environment Variables." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method tidak diizinkan. Gunakan POST." });
  }

  try {
    const { contents } = req.body;

    if (!contents) {
      return res.status(400).json({ error: "Request tidak valid atau kosong." });
    }

    // PERBAIKAN UTAMA: Mengubah 'v1beta' menjadi 'v1' agar cocok dengan API Key berawalan AQ.
    const googleUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Gagal mengambil respons dari Gemini API." });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
