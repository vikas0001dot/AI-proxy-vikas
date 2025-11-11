// ✅ Use CommonJS for Render Node.js
const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Environment
const PORT = process.env.PORT || 10000;
const apiKey = process.env.GROQ_API_KEY?.trim(); // <- ensures no blank key issues

// ✅ Debug info in logs
if (apiKey) {
  console.log("🔑 Loaded API key: ✅ Found");
} else {
  console.log("🔑 Loaded API key: ❌ Missing (check Environment Variable name)");
}

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).send("✅ AI Proxy server is live and working!");
});

// ✅ Chat completion proxy endpoint
app.post("/v1/chat/completions", async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({
      error:
        "API key not found on server. Make sure GROQ_API_KEY is set in Render Environment.",
    });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Proxy request failed:", error.message);
    res.status(500).json({
      error: "Proxy request failed",
      details: error.message,
    });
  }
});

// ✅ Handle invalid routes gracefully
app.use((req, res) => {
  res.status(404).json({ error: "Invalid endpoint. Try POST /v1/chat/completions" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Proxy running successfully on port ${PORT}`);
});
