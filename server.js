const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// JSON
app.use(express.json());

// CORS (IMPORTANTE para browser)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// IA ROUTE
app.post("/perguntar", async (req, res) => {
  try {
    const pergunta = req.body.pergunta;

    const resposta = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: pergunta,
        stream: false
      }
    );

    console.log("DEBUG OLLAMA:", resposta.data);

    const texto =
      resposta.data.response ||
      resposta.data.message?.content ||
      "";

    res.json({ resposta: texto });

  } catch (err) {
    console.log("ERRO IA:", err.message);
    res.status(500).json({ resposta: "Erro ao conectar na IA" });
  }
});

// START
app.listen(3000, () => {
  console.log("SERVER OK: http://localhost:3000");
});