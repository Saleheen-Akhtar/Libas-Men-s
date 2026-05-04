import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-review", async (req, res) => {
  try {
    const { rating, topics, language } = req.body;

    const prompt = `
Generate 3 short Google reviews for a men's clothing store.

Details:
- Rating: ${rating} stars
- Topics: ${topics.join(", ")}
- Language: ${language}
- Style: natural, human, not robotic
- Include shop name "Libas Men's Wear"
- Keep each under 60 words
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    res.json({
      reviews: result.response.text(),
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to generate review" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
