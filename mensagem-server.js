const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const MENSAGENS_ARQUIVO = path.join(__dirname, 'mensagens.json');

// Rota para receber novas mensagens
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

// Rota para exibir todas mensagens
app.get('/api/mensagem', (req, res) => {
  if (!fs.existsSync(MENSAGENS_ARQUIVO)) {
    return res.json([]);
  }
  const mensagens = JSON.parse(fs.readFileSync(MENSAGENS_ARQUIVO));
  res.json(mensagens);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de mensagens rodando em http://localhost:${PORT}`);
});
