const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.XAI_API_KEY ? "https://api.x.ai/v1" : undefined,
});

app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      { role: "system", content: "Sen Grok'sun, xAI tarafından yapılmış eğlenceli, yardımsever ve maksimum doğruluk odaklı bir AI'sın." },
      ...history,
      { role: "user", content: message }
    ];

    const completion = await client.chat.completions.create({
      model: "grok-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content;
    
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Siten http://localhost:${PORT} adresinde çalışıyor!`);
});