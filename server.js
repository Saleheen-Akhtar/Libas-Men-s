import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      reviews: response.choices[0].message.content,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to generate review" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
