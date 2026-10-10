const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Voice API is working"
  });
});

router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[voice/chat] OPENAI_API_KEY is missing");

      return res.status(500).json({
        success: false,
        message: "OpenAI API is not configured"
      });
    }

    const normalizedHistory = Array.isArray(history)
      ? history
        .filter(
          (item) =>
            item &&
            typeof item.text === "string" &&
            item.text.trim() &&
            (item.sender === "user" || item.sender === "bot")
        )
        .slice(-10)
        .map((item) => ({
          role: item.sender === "user" ? "user" : "assistant",
          content: item.text.trim()
        }))
      : [];

    const input = [
      ...normalizedHistory,
      {
        role: "user",
        content: message.trim()
      }
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions:
        "You are Chef AI, the smart and friendly assistant for a Campus Canteen Management System. " +
        "Help students with menu information, food availability, canteen information, order guidance, " +
        "crowd information, food recommendations and general canteen questions. " +
        "Keep responses short, clear and friendly. " +
        "Do not invent real-time order status, payment status, stock quantities or customer information. " +
        "If the application does not provide the required information, clearly say that you do not have that information.",
      input
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty response"
      });
    }

    console.log("[voice/chat] AI response generated successfully");

    return res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error("[voice/chat] Error:", error.message);

    if (error.status) {
      console.error("[voice/chat] OpenAI status:", error.status);
    }

    if (error.code) {
      console.error("[voice/chat] OpenAI code:", error.code);
    }

    return res.status(500).json({
      success: false,
      message: "AI service is temporarily unavailable"
    });
  }
});

module.exports = router;