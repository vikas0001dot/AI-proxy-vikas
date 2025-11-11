// ✅ AI Proxy Server (for Groq API)
// Made for Vikas 💪

const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 10000;
const apiKey = process.env.GROQ_API_KEY; // ✅ FIXED: matches Render environment variable

// Health check route (to show server is live)
app.get("/", (req, res) => {
  res.send("✅ AI Proxy server is live and working!");
});

// Proxy route to forward chat completions to Groq
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
