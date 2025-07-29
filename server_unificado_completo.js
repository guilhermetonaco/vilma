const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// ========== IA: Chat com a Vovó ==========
app.post('/api/chat', async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem) return res.status(400).json({ erro: 'Mensagem não fornecida' });

  try {
    const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é Vilma de Jesus Tonaco, uma avó mineira muito amorosa, carinhosa, espirituosa e cheia de memórias da vida em família. Responda de forma afetuosa, simples, com saudade e sabedoria. Use expressões como 'meu filho', 'comadre', 'que gracinha', 'que benção'."
        },
        {
          role: "user",
          content: mensagem
        }
      ],
      temperature: 0.8
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    });

    const respostaTextual = resposta.data.choices[0].message.content;
    res.json({ resposta: respostaTextual });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar resposta' });
  }
});

// ========== TTS: Geração de Áudio ==========
app.post('/api/tts', async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ erro: 'Texto não fornecido' });

  try {
    const resposta = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      text: texto,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.7 }
    }, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      responseType: 'arraybuffer'
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': resposta.data.length
    });
    res.send(resposta.data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar áudio' });
  }
});

// ========== Imagens para o Carrossel ==========
function listarImagensRecursivamente(diretorio) {
  let resultados = [];
  const arquivos = fs.readdirSync(diretorio);
  arquivos.forEach(arquivo => {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const stat = fs.statSync(caminhoCompleto);
    if (stat.isDirectory()) {
      resultados = resultados.concat(listarImagensRecursivamente(caminhoCompleto));
    } else if (/\.(jpe?g|png|gif|webp)$/i.test(arquivo)) {
      const relativo = path.relative(path.join(__dirname, 'public'), caminhoCompleto).replace(/\\/g, '/');
      resultados.push('/' + relativo);
    }
  });
  return resultados;
}

app.get('/api/imagens', (req, res) => {
  const pastaImagens = path.join(__dirname, 'public', 'imagens');
  if (!fs.existsSync(pastaImagens)) return res.json([]);
  const imagens = listarImagensRecursivamente(pastaImagens);
  res.json(imagens);
});

// ========== Mural de Mensagens ==========
const MENSAGENS_ARQUIVO = path.join(__dirname, 'mensagens.json');

app.post('/api/mensagem', (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem || mensagem.trim() === '') {
    return res.status(400).json({ erro: 'Mensagem inválida' });
  }

  const novaMensagem = {
    texto: mensagem.trim(),
    data: new Date().toISOString()
  };

  let mensagens = [];
  if (fs.existsSync(MENSAGENS_ARQUIVO)) {
    mensagens = JSON.parse(fs.readFileSync(MENSAGENS_ARQUIVO));
  }

  mensagens.push(novaMensagem);
  fs.writeFileSync(MENSAGENS_ARQUIVO, JSON.stringify(mensagens, null, 2));
  res.status(201).json({ sucesso: true });
});

app.get('/api/mensagem', (req, res) => {
  if (!fs.existsSync(MENSAGENS_ARQUIVO)) {
    return res.json([]);
  }
  const mensagens = JSON.parse(fs.readFileSync(MENSAGENS_ARQUIVO));
  res.json(mensagens);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
