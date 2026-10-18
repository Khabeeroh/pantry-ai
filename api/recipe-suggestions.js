
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { ingredientsArr } = req.body || {};

    if (
      !Array.isArray(ingredientsArr) ||
      ingredientsArr.length === 0
    ) {
      return res.status(400).json({
        error: "Please enter at least one ingredient.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the server.",
      });
    }

    const prompt = `
You are PantryPal AI, an expert recipe assistant.

The user's ingredients are:
${ingredientsArr.join(", ")}

Suggest exactly 4 distinct recipes that can be made using
these ingredients. Prioritize Nigerian and West African recipes
when suitable; otherwise suggest appropriate international dishes.

Return ONLY valid JSON in this format:
{
  "suggestions": [
    {
      "title": "Recipe name",
      "description": "Short appealing description",
      "cuisine": "Nigerian, West African, or other cuisine",
      "estimatedTime": "30 minutes"
    }
  ]
}

Return exactly 4 suggestions. Do not use Markdown fences.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini suggestions error:", data);
      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini could not generate suggestions.",
      });
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = JSON.parse(text);

    if (
      !Array.isArray(result.suggestions) ||
      result.suggestions.length !== 4
    ) {
      throw new Error("Gemini did not return exactly 4 suggestions.");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Suggestion endpoint error:", error);
    return res.status(500).json({
      error: error.message || "Unable to generate recipe suggestions.",
    });
  }
}
