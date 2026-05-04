import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.post("/generate-review", async (req, res) => {
  try {
    const { rating, topics, language } = req.body;

    const prompt = `
Generate 3 distinct, short Google reviews for a men's clothing store.

Details:
- Rating: ${rating} stars
- Topics: ${topics.join(", ")}
- Language: ${language}
- Style: natural, human, not robotic
- Include shop name "Libas Men's Wear"
- Keep each under 60 words

You must return ONLY a JSON array of strings containing the 3 reviews. Do not include any markdown formatting like \`\`\`json. Example: ["Review 1", "Review 2", "Review 3"]
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let text = result.response.text();
    text = text.replace(/^\s*\n/g, '').replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '').trim();
    let parsedReviews = [];
    try {
      parsedReviews = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", text);
      parsedReviews = [text]; // Fallback
    }

    res.json({
      reviews: parsedReviews,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to generate review" });
  }
});

if (process.env.VERCEL !== "1") {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

export default app;
