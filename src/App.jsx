import { useState } from "react";
import Main from "../component/Main";
import ClaudeRecipe from "../component/ClaudeRecipe";
import MyRecipes from "../component/MyRecipe";


export default function App() {
  const [page, setPage] = useState("home");
  const [recipe, setRecipe] = useState(null);
  const [ingredientsArr, setIngredientsArr] = useState([]);

  function handleRecipeGenerated(newRecipe, ingredientsArray = []) {
    setRecipe(newRecipe);
    setIngredientsArr(ingredientsArray);
    setPage("recipe");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleOpenSavedRecipe(savedRecipe) {
    setRecipe(savedRecipe);
    setIngredientsArr(savedRecipe.userIngredients || []);
    setPage("recipe");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0]">

      {page === "home" && (
        <Main
          onRecipeGenerated={handleRecipeGenerated}
          onGoToRecipes={() => setPage("saved")}
           onGoHome={() => setPage("home")}
        />
      )}

      {page === "recipe" && recipe && (
        <ClaudeRecipe
          recipe={recipe}
          ingredientsArr={ingredientsArr}
          onBack={() => setPage("home")}
          onGoToRecipes={() => setPage("saved")}
        />
      )}

      {page === "saved" && (
        <MyRecipes
          onOpenRecipe={handleOpenSavedRecipe}
          onBack={() => setPage("home")}
          onGoToRecipes={() => setPage("saved")}
        />
      )}

    </div>
  );
}