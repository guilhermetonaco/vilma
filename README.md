# Memorial da Vovó Vilma – Guia de Instalação e Hospedagem

Este projeto é um site interativo memorial da Vilma de Jesus Tonaco, com galeria de fotos, áudios e um chat com inteligência artificial que simula sua personalidade e voz.

---

## 📁 Estrutura dos Arquivos

- `index.html` → Página inicial
- `colecao.html` → Galeria de fotos com botão "Ouvir Momento"
- `chat.html` → Chat com IA da Vilma (via OpenAI + ElevenLabs)
- `foto1.jpg` até `foto6.jpg` → Imagens da galeria
- `uploads/audio1.mp3` até `audio6.mp3` → Áudios da galeria

---

## ☁️ Hospedagem no Hostinger

### 1. Acesse o Gerenciador de Arquivos
- Vá para o painel da Hostinger (hPanel)
- Clique em **"Acessar arquivos de familiatonaco.com.br"**

### 2. Envie os arquivos do site
- Extraia o `.zip` final (`site_vilma_integrado_com_backend.zip`)
- Envie os arquivos `index.html`, `colecao.html`, `chat.html`, e as imagens diretamente para a pasta `public_html`

### 3. Upload dos áudios
- Crie uma pasta chamada `/uploads` dentro de `public_html`
- Coloque os arquivos `audio1.mp3` até `audio6.mp3` nela

---

## 🤖 Backend com IA e voz (Render.com)

Seu backend está hospedado em:  
🔗 `https://vilma-inga.onrender.com`

Ele oferece:
- `/api/chat` → responde como a Vovó Vilma usando OpenAI
- `/api/tts` → gera voz da Vilma com ElevenLabs (Voice ID já configurado)

---

## 📢 Requisitos do Backend

Variáveis de ambiente no Render.com:
```
OPENAI_API_KEY=... (sua chave da OpenAI)
ELEVENLABS_API_KEY=... (sua chave da ElevenLabs)
ELEVENLABS_VOICE_ID=ETZqol1ziyKtvf99Pb4c
```

---

## 🌐 Acessando o site

- Página inicial: `https://familiatonaco.com.br`
- Galeria: `https://familiatonaco.com.br/colecao.html`
- Chat com IA: `https://familiatonaco.com.br/chat.html`

---

## 🛠 Suporte

Se desejar evoluir o projeto, incluir linha do tempo, álbum cronológico ou reconhecimento de voz, é possível integrar facilmente via:
- MongoDB Atlas para memórias e registros
- Web Speech API para entrada por voz
- ElevenLabs Stream API para voz em tempo real

---

Desenvolvido com amor pela família ❤️ 
