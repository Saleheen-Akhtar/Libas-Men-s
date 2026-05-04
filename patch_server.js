import fs from 'fs';

let content = fs.readFileSync('server.js', 'utf8');

const oldPromptBlock = `    const prompt = \`
Generate 3 short Google reviews for a men's clothing store.

Details:
- Rating: \${rating} stars
- Topics: \${topics.join(", ")}
- Language: \${language}
- Style: natural, human, not robotic
- Include shop name "Libas Men's Wear"
- Keep each under 60 words
\`;`;

const newPromptBlock = `    const prompt = \`
Generate 3 distinct, short Google reviews for a men's clothing store.

Details:
- Rating: \${rating} stars
- Topics: \${topics.join(", ")}
- Language: \${language}
- Style: natural, human, not robotic
- Include shop name "Libas Men's Wear"
- Keep each under 60 words

You must return ONLY a JSON array of strings containing the 3 reviews. Do not include any markdown formatting like \`\`\`json. Example: ["Review 1", "Review 2", "Review 3"]
\`;`;

content = content.replace(oldPromptBlock, newPromptBlock);

const oldResultBlock = `    res.json({
      reviews: result.response.text(),
    });`;

const newResultBlock = `    let text = result.response.text();
    text = text.replace(/^\\s*\\n/g, '').replace(/^\\s*\`\`\`json\\s*/, '').replace(/\\s*\`\`\`\\s*$/, '').trim();
    let parsedReviews = [];
    try {
      parsedReviews = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", text);
      parsedReviews = [text]; // Fallback
    }

    res.json({
      reviews: parsedReviews,
    });`;

content = content.replace(oldResultBlock, newResultBlock);

fs.writeFileSync('server.js', content);
console.log('patched');
