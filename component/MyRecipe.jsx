import { useState, useEffect } from "react";
import Header from "./Header";

export default function MyRecipes({ onOpenRecipe, onBack, onGoToRecipes }) {
  const [recipes, setRecipes] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("pantryPalRecipes")) || []
    );
  });
  
    // Reload recipes from localStorage when component mounts
  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("pantryPalRecipes")) || [];
    setRecipes(savedRecipes);
  }, []);

  function removeRecipe(id) {
    const updatedRecipes = recipes.filter(
      (recipe) => recipe.id !== id
    );

    localStorage.setItem(
      "pantryPalRecipes",
      JSON.stringify(updatedRecipes)
    );

    setRecipes(updatedRecipes);
  }

  if (recipes.length === 0) {
    return (
      <>
      <Header
      onGoToRecipes={onGoToRecipes}
      onBack={onBack}
      />
        <main className="min-h-screen bg-[#FFF9F0] px-6 py-16">

        <div className="mx-auto max-w-4xl text-center">
        
             <button
              type="button"
              onClick={onBack}
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#E8751A]"
            >
              ← Back to Home
            </button>

          <div className="text-7xl">
            🍽️
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#164C3A]">
            Your cookbook is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-gray-600">
            Generate a recipe and save it to start building
            your personal cookbook.
          </p>

        </div>

      </main>
      </>
    );
  }

  return (
   <>
      {/* <Header /> */}
       <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-20 py-5">

        {/* Logo */}
        <button
          type="button"
          className="text-xl font-bold text-[#164C3A]"
          onClick={onBack}
        >
          🥕 PantryPal AI
        </button>        
      </div>
    </header>



       <main className="min-h-screen bg-[#FFF9F0] px-6 py-12">

      <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={onBack}
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#E8751A]"
            >
              ← Back to Home
            </button>

        <h1 className="text-4xl font-bold text-[#164C3A]">
          My Recipes
        </h1>

        <p className="mt-2 text-gray-600">
          Your personal collection of saved recipes.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {recipes.map((recipe) => (

            <div
              key={recipe.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >

              <div className="h-48 overflow-hidden">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-green-100 to-orange-100 text-7xl">
                    🍛
                  </div>
                )}
              </div>

              <div className="p-5">

                <h2 className="text-xl font-bold text-[#164C3A]">
                  {recipe.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {recipe.cookingTime} · {recipe.difficulty}
                </p>

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() => onOpenRecipe(recipe)}
                    className="flex-1 rounded-xl bg-[#164C3A] px-4 py-3 text-sm font-semibold text-white"
                  >
                    View Recipe
                  </button>

                  <button
                    onClick={() => removeRecipe(recipe.id)}
                    className="rounded-xl border border-red-100 px-4 py-3 text-red-500"
                  >
                    🗑️
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
   </>
  );
}