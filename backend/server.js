import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const HF_API_KEY = process.env.HF_API_KEY;
const HF_API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";

app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 40,
          do_sample: false
        }
      }),
    });

    // Try to parse JSON safely
    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error("❌ Not valid JSON from Hugging Face:", raw.slice(0, 300));
      return res.status(500).json({ error: "Invalid JSON response from Hugging Face" });
    }

    console.log("✅ Hugging Face response:", data);

    // Extract summary safely
    let summary = "No summary found.";
    if (Array.isArray(data) && data[0]) {
      summary = data[0].summary_text || data[0].generated_text || JSON.stringify(data[0]);
    } else if (data.summary_text) {
      summary = data.summary_text;
    } else if (data.generated_text) {
      summary = data.generated_text;
    } else if (data.error) {
      summary = `⚠️ Model error: ${data.error}`;
    }

    res.json({ summary });
  } catch (err) {
    console.error("❌ Error summarizing:", err);
    res.status(500).json({ error: "Failed to summarize" });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// 🌐 Translate Route (Odia)
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    const response = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|" + targetLang);
    const data = await response.json();

    const translated = data.responseData.translatedText;
    res.json({ translated });
  } catch (err) {
    console.error("Translation failed:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});
