
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { ingredientsArr, selectedRecipe } = req.body || {};

    if (
      !Array.isArray(ingredientsArr) ||
      ingredientsArr.length === 0 ||
      !selectedRecipe
    ) {
      return res.status(400).json({
        error: "Ingredients and a selected recipe are required.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the server.",
      });
    }

    const prompt = `
You are PantryPal AI, an expert chef who explains recipes clearly.

The user's available ingredients are:
${ingredientsArr.join(", ")}

Generate a complete recipe for:
${selectedRecipe}

Prioritize Nigerian or West African cooking when appropriate.
Do not claim the user has ingredients that they did not provide;
list additional ingredients separately where necessary.

Return ONLY valid JSON using this exact structure:
{
  "title": "Recipe title",
  "description": "Short description",
  "cookingTime": "30 minutes",
  "prepTime": "10 minutes",
  "difficulty": "Easy",
  "servings": 2,
  "cuisine": "Nigerian",
  "ingredients": [
    "Ingredient with quantity"
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "tips": [
    "Helpful cooking tip"
  ]
}

Make the instructions practical, numbered by array order,
and detailed enough for a student to follow.
Do not use Markdown fences.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
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
      console.error("Gemini recipe error:", data);
      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini could not generate the recipe.",
      });
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    if (!text) {
      throw new Error("Gemini returned an empty recipe.");
    }

    const recipe = JSON.parse(text);

    if (
      !recipe.title ||
      !Array.isArray(recipe.ingredients) ||
      !Array.isArray(recipe.instructions)
    ) {
      throw new Error("Gemini returned an incomplete recipe.");
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Recipe endpoint error:", error);
    return res.status(500).json({
      error: error.message || "Unable to generate the recipe.",
    });
  }
}
