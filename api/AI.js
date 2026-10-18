

async function callRecipeAPI(endpoint, payload) {
  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Network error:", error);
    throw new Error(
      "Cannot connect to the recipe server. Check that your backend is running."
    );
  }

  // Read the response only once.
  const responseText = await response.text();

  console.log("API endpoint:", endpoint);
  console.log("HTTP status:", response.status);
  console.log("Raw API response:", responseText);

  if (!responseText.trim()) {
    throw new Error(
      `The server returned an empty response (HTTP ${response.status}). Check your backend function and server logs.`
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `The server returned invalid JSON (HTTP ${response.status}). Check that the API endpoint is returning JSON, not HTML or an error page.`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}


// LOCAL RECIPE IMAGES
const recipeImages = {
  "jollof rice": "./images/jollof-rice.png",
  "efo riro": "./images/efo.png",
  "egusi soup": "./images/egusi.png",
  "moi moi": "./images/moimoi.jpg",
  "fried rice": "./images/fried-rice.jpg",
  "pepper soup": "./images/pepper-soup.jpg",
  "yam porridge": "./images/yam-porridge.jpg",
};

function getRecipeImage(title = "") {
  const recipeName = title.toLowerCase();

  const match = Object.keys(recipeImages).find((name) =>
    recipeName.includes(name)
  );

  return match
    ? recipeImages[match]
    : "./images/recipe-generated1.png";
}

// STEP 1: GENERATE FOUR RECIPE SUGGESTIONS
export async function getRecipeSuggestions(ingredientsArr) {
  if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) {
    throw new Error("Please enter your ingredients first.");
  }

  const data = await callRecipeAPI("/api/recipe-suggestions", {
    ingredientsArr,
  });

  if (!Array.isArray(data.suggestions)) {
    throw new Error("The AI returned invalid recipe suggestions.");
  }

  return data.suggestions;
}

// STEP 2: GENERATE THE SELECTED RECIPE
export async function getRecipeFromMistral(
  ingredientsArr,
  selectedRecipe
) {
  if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) {
    throw new Error("Please enter your ingredients first.");
  }

  if (!selectedRecipe) {
    throw new Error("Please select a recipe first.");
  }

  const recipe = await callRecipeAPI("/api/generate-recipe", {
    ingredientsArr,
    selectedRecipe,
  });

  const ingredients = recipe.ingredients.map((ingredient, index) => {
    if (typeof ingredient === "string" && ingredient.trim()) {
      return { name: ingredient.trim(), quantity: "" };
    }

    if (
      ingredient &&
      typeof ingredient === "object" &&
      typeof ingredient.name === "string"
    ) {
      return {
        name: ingredient.name,
        quantity: ingredient.quantity ?? "",
      };
    }

    throw new Error(`The AI returned an invalid ingredient at position ${index + 1}.`);
  });

  const instructions = recipe.instructions.map((instruction, index) => {
    if (typeof instruction === "string" && instruction.trim()) {
      return {
        step: index + 1,
        title: `Step ${index + 1}`,
        description: instruction.trim(),
      };
    }

    if (
      instruction &&
      typeof instruction === "object" &&
      typeof instruction.description === "string"
    ) {
      return {
        step: instruction.step ?? index + 1,
        title: instruction.title || `Step ${index + 1}`,
        description: instruction.description,
      };
    }

    throw new Error(`The AI returned an invalid instruction at position ${index + 1}.`);
  });

  return {
    ...recipe,
    ingredients,
    instructions,
    image: getRecipeImage(recipe.title),
  };
}
