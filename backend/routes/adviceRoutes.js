import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Basic prompt template
const generatePrompt = (weather, market) => `
You are an agricultural assistant. Based on the following data, give a short and useful farming advice (max 2 sentences).

Weather Info:
Condition: ${weather.condition}
Temperature: ${weather.temperature}°C
Humidity: ${weather.humidity}%

Market Info:
Crop: ${market.name}
Current Price: Rs.${market.price}/kg
Trend: ${market.trend}

Provide advice relevant to farmers.
`;

router.post("/", async (req, res) => {
  try {
    const { weather, market } = req.body;
    const prompt = generatePrompt(weather, market);

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    const advice =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No advice generated.";

    res.json({ advice });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate advice" });
  }
});

export default router;
