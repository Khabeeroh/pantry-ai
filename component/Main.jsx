import { useState } from "react";
import { getRecipeFromMistral } from "../api/AI";
import { presetRecipes } from "/data/recipe";
import Header from "./Header";

export default function Main({ onRecipeGenerated, onGoToRecipes, onGoHome }) {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();

    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const ingredientsArray = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean);

      const recipe = await getRecipeFromMistral(ingredientsArray);

      onRecipeGenerated(recipe, ingredientsArray);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Something went wrong while generating your recipe."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Header 
        onGoToRecipes={onGoToRecipes}
        onBack={onGoHome} />

      {/* Hero */}
      <section data-aos="fade-up" className="px-6 py-16 md:px-12 lg:px-20">
        
        <div className="mx-auto max-w-6xl">  
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left */}
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#E8751A]">
                AI Powered Cooking Assistant
              </p>

              <h1 className="max-w-xl text-4xl sm:text-5xl font-bold leading-tight text-[#164C3A] md:text-6xl">
                Your ingredients already know what to become.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
                Tell PantryPal what you have in your kitchen and let AI create a delicious, personalized recipe for you.
              </p>

              {/* Input card */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-3xl bg-white p-5 shadow-xl"
              >

                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  What's in your kitchen?
                </label>

                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. chicken, rice, tomatoes, onions..."
                  className="w-full rounded-2xl border border-gray-200 bg-[#FFFDF8] px-5 py-4 text-gray-800 outline-none transition focus:border-[#E8751A] focus:ring-2 focus:ring-orange-100"
                />

                {error && (
                  <p className="mt-3 text-sm text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8751A] px-6 py-4 font-semibold text-white transition hover:bg-[#D9650D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Creating your recipe...
                    </>
                  ) : (
                    <>✨ Create My Recipe</>
                  )}
                </button>

              </form>

              {/* Quick options */}
              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setIngredients("chicken, rice, tomatoes, onions, pepper")
                  }
                  className="rounded-full bg-white px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
                >
                  🇳🇬 Nigerian
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIngredients("eggs, bread, avocado, tomatoes")
                  }
                  className="rounded-full bg-white px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
                >
                  ⚡ Quick meal
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIngredients("chicken, eggs, vegetables, rice")
                  }
                  className="rounded-full bg-white px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
                >
                  💪 High protein
                </button>

              </div>

            </div>

            {/* Right image */}
            <div className="relative">

              <div className="overflow-hidden rounded-4xl shadow-2xl">
                <img
                  src="./homeimage.png"
                  alt="Delicious meal"
                  className="h-100 sm:h-125 w-full object-cover"
                />
              </div>

              <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
                <p className="text-sm font-semibold text-[#164C3A]">
                  ✨ Good food, better mood
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Explore */}
    <section className="px-6 pb-16 md:px-12 lg:px-20">
  <div className="mx-auto max-w-6xl">

    <div className="mb-6">
      <h2 className="text-3xl font-bold text-[#164C3A]">
        Explore Nigerian Cuisine
      </h2>

      <p className="mt-2 text-gray-600">
        Discover authentic dishes and the taste of home.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-4">

      {presetRecipes.map((recipe) => (
        <button
          key={recipe.id}
          type="button"
          onClick={() => onRecipeGenerated(recipe)}
          className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
           data-aos="fade-up"
        >

          <div className="h-44 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-4">

            <h3 className="font-bold text-[#164C3A]">
              {recipe.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {recipe.cookingTime} · {recipe.difficulty}
            </p>

            <p className="mt-3 text-sm font-semibold text-[#E8751A]">
              View Recipe →
            </p>

          </div>

        </button>
      ))}

    </div>

  </div>
</section>

    </main>
  );
}