// File: api/gemini.js
// Menggunakan gaya penulisan CommonJS murni yang didukung Vercel secara default

module.exports = async function handler(req, res) {
  // Ambil API Key dari Environment Variable Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: "API Key tidak ditemukan di server. Pastikan GEMINI_API_KEY sudah diatur di Environment Variables Vercel." 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method tidak diizinkan. Gunakan POST." });
  }

  try {
    const { contents } = req.body;

    if (!contents || !contents[0]?.parts?.[0]?.text) {
      return res.status(400).json({ error: "Format body request tidak valid atau prompt kosong." });
    }

    // Panggil endpoint resmi Google Gemini API
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || "Gagal mengambil respons dari Google Gemini API." 
      });
    }

    // Kembalikan hasilnya ke frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error internal server proxy:", error);
    return res.status(500).json({ error: `Terjadi kesalahan internal pada server proxy: ${error.message}` });
  }
};
