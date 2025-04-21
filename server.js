const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const cors = require("cors");
require("dotenv").config(); // ✅ Load .env variables

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend from public folder

const COHERE_API_KEY = process.env.COHERE_API_KEY;

// ✅ Confirm if API key is loaded
if (!COHERE_API_KEY) {
  console.error("❌ Cohere API Key not found. Make sure it's in .env file.");
  process.exit(1); // Stop server if no API key
}

// ✅ API Endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const prompt = `You are a helpful cooking assistant. Answer this user's question about recipes or ingredients: "${userMessage}"`;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command", // safer default model
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE"
      })
    });

    const data = await response.json();

    // ✅ Log response from Cohere
    console.log("📦 Cohere API response:", data);

    const reply = data.generations?.[0]?.text?.trim() || "Sorry, I couldn’t find an answer.";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error connecting to Cohere API:", error);
    res.status(500).json({ reply: "Oops! Something went wrong on the server." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
