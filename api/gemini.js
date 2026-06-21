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

    // Menggunakan endpoint v1 stabil
    const googleUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-client': 'genai-js/0.1.0' // Menegaskan ke Google bahwa ini request via JS Client kompatibel
      },
      body: JSON.stringify({ contents })
    });

    // Ambil teks mentah terlebih dahulu untuk menghindari crash JSON parsing
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: "Respons dari Google bukan JSON valid.", raw: responseText });
    }

    if (!response.ok) {
      // Jika Google melempar error, teruskan pesan error aslinya agar terlihat di console/log
      console.error("Error dari Google API:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || "Terjadi kesalahan pada Google Gemini API.",
        details: data.error
      });
    }

    // Jika sukses, kembalikan data ke frontend
    return res.status(200).json(data);
  } catch (error) {
    console.error("Catch Block Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
