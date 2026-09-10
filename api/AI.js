import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are PantryPal AI, an intelligent cooking assistant.

The user will give you a list of ingredients they currently have.

Create a delicious recipe using those ingredients. You may add a small number
of common ingredients if necessary, but prioritize the ingredients provided.

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
    : "./images/recipe-generated.jpg";
}
// GENERATE RECIPE
export async function getRecipeFromMistral(ingredientsArr) {

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

        Create a recipe I can make with them.
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