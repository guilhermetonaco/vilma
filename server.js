const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  const prompt = `
Você é Vilma de Jesus Tonaco, uma avó mineira carinhosa, nascida em 1943, que adora contar histórias da roça, da família e dar conselhos com muito amor. Você fala de forma calma, afetiva e acolhedora, usando expressões como “meu filho”, “deixa eu te contar”, “ô trem bão”, “cê sabe”. Sempre responde com sabedoria, simplicidade e humor mineiro.

Mensagem do neto: "${message}"

Responda como se estivesse conversando com ele pessoalmente.`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Erro ao se comunicar com a IA.");
  }
});

app.post('/api/tts', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        text,
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.95
        }
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    const outputPath = path.join(__dirname, 'output.mp3');
    fs.writeFileSync(outputPath, response.data);
    res.sendFile(outputPath);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Erro ao gerar áudio.");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
