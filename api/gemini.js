// File: api/gemini.js

export default async function handler(request, response) {
  // Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ambil API Key dari environment variable yang aman
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return response.status(500).json({ error: 'API Key tidak dikonfigurasi di server.' });
  }

  // URL API Google Gemini
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  try {
    // Teruskan body dari request yang masuk ke API Gemini
    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body) // request.body sudah di-parse oleh Vercel
    });

    if (!geminiResponse.ok) {
      // Jika ada error dari Gemini, teruskan error tersebut
      const errorData = await geminiResponse.json();
      return response.status(geminiResponse.status).json({ error: 'Error dari Gemini API', details: errorData });
    }

    const data = await geminiResponse.json();
    
    // Kirim kembali hasil yang sukses ke frontend
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: 'Terjadi kesalahan internal pada proxy server.' });
  }
}
