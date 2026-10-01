import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are PantryPal AI, an intelligent cooking assistant
with strong knowledge of Nigerian, West African, and international cuisine.

The user will provide ingredients and select a specific recipe.

Your job is to generate the complete recipe for the selected dish.

IMPORTANT:
- Respect the selected recipe exactly.
- Prioritize the ingredients provided by the user.
- Use realistic Nigerian cooking methods when the selected dish is Nigerian.
- Use familiar Nigerian ingredient names and measurements where appropriate.
- You may add a small number of common ingredients when necessary.
- Do not completely change the selected dish into another recipe.
- Keep quantities realistic.
- Make the instructions clear enough for a home cook to follow.

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not include any text before or after the JSON.

Use exactly this structure:

{
  "title": "Recipe name",
  "description": "Short description of the recipe",
  "cookingTime": "30 mins",
  "prepTime": "10 mins",
  "difficulty": "Easy",
  "servings": 4,
  "cuisine": "Nigerian",
  "ingredients": [
    {
      "name": "Rice",
      "quantity": "2 cups"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Prepare the ingredients",
      "description": "Wash and prepare all the ingredients."
    }
  ],
  "tips": [
    "Add more pepper if you prefer a spicy meal."
  ]
}
`;

const RECIPE_SUGGESTION_PROMPT = `
You are PantryPal AI, a smart cooking assistant for Nigerian and
international home cooks.

The user will provide ingredients they currently have.

First, understand the ingredients as a combination.

If the ingredients naturally support Nigerian cuisine:
- Prioritize Nigerian dishes.
- Use familiar Nigerian meal names.
- Prefer traditional Nigerian combinations.
- Think like a Nigerian home cook.

If the ingredients do not naturally support Nigerian cuisine:
- Do not force Nigerian food.
- Suggest suitable international dishes instead.

If both Nigerian and international dishes are possible:
- Prioritize Nigerian dishes.
- You may include an international option for variety.

Examples:

yam + vegetable leaf + chicken + palm oil
→ Pounded Yam with Efo Riro & Chicken
→ Boiled Yam with Efo Riro
→ Yam Pottage with Chicken

rice + tomatoes + pepper + onions + chicken
→ Nigerian Chicken Jollof Rice
→ Nigerian Chicken Fried Rice

pasta + cheese + mushrooms + garlic
→ Creamy Mushroom Pasta
→ Garlic Cheese Pasta

Important:
- Suggest exactly 4 recipes.
- Keep descriptions SHORT.
- Each description should be one short sentence.
- Prioritize the user's ingredients.
- Only suggest a small number of additional common ingredients.
- Make each suggestion meaningfully different.
- Do not generate the full recipe yet.
- Do not invent traditional Nigerian dishes.

Return ONLY valid JSON.
No markdown.
No code fences.
No explanation.
No text before or after the JSON.

Use exactly this structure:

{
  "suggestions": [
    {
      "title": "Pounded Yam with Efo Riro & Chicken",
      "description": "Soft pounded yam served with Nigerian vegetable soup and chicken.",
      "cuisine": "Nigerian",
      "estimatedTime": "50 mins"
    }
  ]
}
`;

const apikey = import.meta.env.VITE_RECIPE_API_KEY;

if (!apikey) {
  throw new Error("VITE_RECIPE_API_KEY is missing");
}

const hf = new HfInference(apikey);


// // GENERATE RECIPE IMAGE
// export async function generateRecipeImage(recipe) {
//   try {
//     const prompt = `
//       A realistic, appetizing food photograph of "${recipe.title}".
      
//       ${recipe.description}

//       The dish should look freshly cooked and beautifully plated.
//       Authentic Nigerian cuisine style where appropriate.
//       Natural food photography.
//       Realistic food textures.
//       Warm lighting.
//       Professional restaurant-quality presentation.
//       The food should be the main focus.
//       No text, no words, no labels, no watermark.
//     `;
    
//     console.log("Generating image for:", recipe.title);

//     const imageBlob = await hf.textToImage({
//       model: "krea/Krea-2-Turbo",
//       inputs: prompt,
//     });

//     console.log("Image generated successfully!");

//     return URL.createObjectURL(imageBlob);

//   } catch (error) {
//     console.error("Recipe image generation error:", error);

//     return null;
//   }
// }

const recipeImages = {
  "jollof rice": "./images/jollof-rice.png",
  "efo riro": "./images/efo.png",
  "egusi soup": "./images/egusi.png",
  "moi moi": "./images/moimoi.jpg",
  "fried rice": "./images/fried-rice.jpg",
  "pepper soup": "./images/pepper-soup.jpg",
  "yam porridge": "./images/yam-porridge.jpg",
};

function getRecipeImage(title) {
  const recipeName = title.toLowerCase();

  const match = Object.keys(recipeImages).find((name) =>
    recipeName.includes(name)
  );

  return match
    ? recipeImages[match]
    : "./images/recipe-generated1.png";
}

// Suggested Recipe
export async function getRecipeSuggestions(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  try {
    console.log("Sending ingredients to AI:", ingredientsString);

    const response = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-V4-Flash-0731",

      messages: [
        {
          role: "system",
          content: RECIPE_SUGGESTION_PROMPT,
        },
        {
          role: "user",
          content: `
I currently have these ingredients:

${ingredientsString}

Suggest different meals I can make with them.
`,
        },
      ],

      max_tokens: 2048,
    });

    console.log("Full AI response:", response);

    const suggestionText =
      response?.choices?.[0]?.message?.content;

    if (!suggestionText) {
      const reasoning =
        response?.choices?.[0]?.message?.reasoning_content;

      console.log("AI reasoning:", reasoning);

      throw new Error(
        "The AI used all available tokens for reasoning and did not return the recipe suggestions."
      );
    }

    console.log("Suggestion text:", suggestionText);

    const cleanedSuggestions = suggestionText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Cleaned suggestions:", cleanedSuggestions);

    const parsedSuggestions = JSON.parse(cleanedSuggestions);

    if (
      !parsedSuggestions.suggestions ||
      !Array.isArray(parsedSuggestions.suggestions)
    ) {
      throw new Error(
        "AI response does not contain a valid suggestions array."
      );
    }

    return parsedSuggestions;

  } catch (error) {
    console.error("Recipe suggestion error:", error);

    throw new Error(
      error.message ||
        "Unable to generate recipe suggestions. Please try again."
    );
  }
}

// GENERATE RECIPE
export async function getRecipeFromMistral(ingredientsArr, selectedRecipe) {

  const ingredientsString = ingredientsArr.join(", ");

  try {

    // Generate the recipe
    const response = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-V4-Flash-0731",

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },

      {
          role: "user",
          content: `
        I currently have these ingredients:

        ${ingredientsString}

        The user selected this recipe:

        ${selectedRecipe}

        Create the complete recipe for this exact dish.

        Do not change it into another dish.
        `,
        },
      ],

      max_tokens: 2048,
    });


    // Get recipe response
    const recipeText =
      response.choices?.[0]?.message?.content;


    if (!recipeText) {
      throw new Error("No recipe was generated.");
    }


    // Remove accidental markdown code fences
    const cleanedRecipe = recipeText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    // Convert JSON string into JavaScript object
    const recipe = JSON.parse(cleanedRecipe);



    // GENERATE IMAGE AFTER RECIPE

    // const image = await generateRecipeImage(recipe);


    // Return recipe + image
    return {
      ...recipe,
       image: getRecipeImage(recipe.title),
    };


  } catch (error) {

    console.error("Recipe generation error:", error);

    throw new Error(
      "Unable to generate the recipe. Please try again."
    );

  }
}

