import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Main from "../component/Main";
import ClaudeRecipe from "../component/ClaudeRecipe";
import MyRecipes from "../component/MyRecipe";
import Profile from "../component/Profile";

import Login from "../component/Login";
import SignUp from "../component/SignUp";
import { AuthProvider, useAuth } from "../component/AuthContext";


function PantryPalApp() {
  const { user, loading } = useAuth();

  const [page, setPage] = useState("home");
  const [recipe, setRecipe] = useState(null);
  const [ingredientsArr, setIngredientsArr] = useState([]);

  const [authPage, setAuthPage] = useState("login");

  useEffect(() => {
    AOS.init({
      duration: 1500,
      offset: 100,
    });
  }, []);

 function handleGoToProfile() {
  setPage("profile");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  function handleRecipeGenerated(
    newRecipe,
    ingredientsArray = []
  ) {
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

    setIngredientsArr(
      savedRecipe.userIngredients || []
    );

    setPage("recipe");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Wait for Supabase to check existing session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0]">
        <div className="text-center">
          <div className="text-5xl">🥕</div>

          <p className="mt-4 font-semibold text-[#164C3A]">
            Loading PantryPal...
          </p>
        </div>
      </div>
    );
  }

  // User is NOT logged in
  if (!user) {
    if (authPage === "signup") {
      return (
        <SignUp
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onSignUp={() => setAuthPage("signup")}
      />
    );
  }

  // User IS logged in
  return (
    <div className="min-h-screen bg-[#FFF9F0]">

      {page === "home" && (
        <Main
          onRecipeGenerated={handleRecipeGenerated}
          onGoToRecipes={() => setPage("saved")}
          onGoHome={() => setPage("home")}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {page === "recipe" && recipe && (
        <ClaudeRecipe
          recipe={recipe}
          ingredientsArr={ingredientsArr}
          onBack={() => setPage("home")}
          onGoToRecipes={() => setPage("saved")}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {page === "saved" && (
        <MyRecipes
          onOpenRecipe={handleOpenSavedRecipe}
          onBack={() => setPage("home")}
          onGoToRecipes={() => setPage("saved")}
          onGoToProfile={handleGoToProfile}
        />
      )}

      {page === "profile" && (
        <Profile
          onGoToRecipes={() => setPage("saved")}
          onBack={() => setPage("home")}
          onGoToProfile={handleGoToProfile}
        />
      )}

    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <PantryPalApp />
    </AuthProvider>
  );
}