import { useState, useEffect } from "react";
import Header from "./Header";
import { supabase } from "../api/supabase";

export default function MyRecipes({
  onOpenRecipe,
  onBack,
  onGoToRecipes,
}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load recipes from Supabase
  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setRecipes([]);
          return;
        }

        const { data, error: recipesError } = await supabase
          .from("saved_recipes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (recipesError) {
          throw recipesError;
        }

        // Convert Supabase data to the format
        // your recipe page already expects
        const formattedRecipes = (data || []).map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          cookingTime: recipe.cooking_time,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          tips: recipe.tips || [],
          userIngredients: recipe.user_ingredients || [],
        }));

        setRecipes(formattedRecipes);
      } catch (error) {
        console.error("Error loading recipes:", error);
        setError(
          error.message || "Something went wrong while loading your recipes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  // Delete recipe from Supabase
  async function removeRecipe(id) {
    try {
      setError("");

      const { error: deleteError } = await supabase
        .from("saved_recipes")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove it from the screen immediately
      setRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe.id !== id)
      );
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError(
        error.message || "Something went wrong while deleting the recipe."
      );
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header
          onGoToRecipes={onGoToRecipes}
          onBack={onBack}
        />

        <main className="flex min-h-screen items-center justify-center bg-[#FFF9F0] px-6">
          <div className="text-center">
            <div className="text-6xl">🥕</div>

            <p className="mt-4 font-semibold text-[#164C3A]">
              Loading your recipes...
            </p>
          </div>
        </main>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header
          onGoToRecipes={onGoToRecipes}
          onBack={onBack}
        />

        <main className="min-h-screen bg-[#FFF9F0] px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-6xl">😕</div>

            <h1 className="mt-6 text-2xl font-bold text-[#164C3A]">
              Something went wrong
            </h1>

            <p className="mt-3 text-gray-600">
              {error}
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 rounded-xl bg-[#164C3A] px-5 py-3 font-semibold text-white"
            >
              Back to Home
            </button>
          </div>
        </main>
      </>
    );
  }

  // Empty state
  if (recipes.length === 0) {
    return (
      <>
        <Header
          onGoToRecipes={onGoToRecipes}
          onBack={onBack}
        />

        <main className="min-h-screen bg-[#FFF9F0] px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">


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
      <Header
        onGoToRecipes={onGoToRecipes}
        onBack={onBack}
        currentPage="saved"
      />

      <main
        // data-aos="fade-up"
        className=" bg-[#FFF9F0] px-6 py-12"
      >
        <div className="mx-auto max-w-6xl">

          {/* <button
            type="button"
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#E8751A]"
          >
            ← Back to Home
          </button> */}

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