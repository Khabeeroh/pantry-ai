import { useState } from "react";
import Header from "./Header";

export default function ClaudeRecipe({ recipe, onBack }) {
  const [comingSoonMessage, setComingSoonMessage] = useState("");
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [saved, setSaved] = useState(false);

const [showShoppingList, setShowShoppingList] = useState(false);
const [purchasedItems, setPurchasedItems] = useState([]);
const [copied, setCopied] = useState(false);
  

  function showComingSoon(message) {
  setComingSoonMessage(message);

  setTimeout(() => {
    setComingSoonMessage("");
  }, 3000);
}

  function saveRecipe() {
    const savedRecipes =
      JSON.parse(localStorage.getItem("pantryPalRecipes")) || [];

    const alreadySaved = savedRecipes.some(
      (item) => item.title === recipe.title
    );

    if (!alreadySaved) {
      localStorage.setItem(
        "pantryPalRecipes",
        JSON.stringify([...savedRecipes, recipe])
      );
    }

    setSaved(true);
  }

  function togglePurchased(index) {
  setPurchasedItems((prev) =>
    prev.includes(index)
      ? prev.filter((item) => item !== index)
      : [...prev, index]
  );
}

async function copyShoppingList() {
  const shoppingList = recipe.ingredients
    .map(
      (ingredient) =>
        `- ${ingredient.name}: ${ingredient.quantity}`
    )
    .join("\n");

  try {
    await navigator.clipboard.writeText(
      `${recipe.title} - Shopping List\n\n${shoppingList}`
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);

  } catch (error) {
    console.error("Failed to copy shopping list:", error);
  }
}

  function nextStep() {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  if (showCookingMode) {
    const instruction = recipe.instructions[currentStep];

    return (
      <main className="min-h-screen bg-[#FFF9F0] px-6 py-10">

        <div className="mx-auto max-w-3xl">

          <button
            onClick={() => setShowCookingMode(false)}
            className="mb-10 text-sm font-medium text-gray-600 hover:text-[#164C3A]"
          >
            ← Back to recipe
          </button>

          <div className="mb-8 text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#E8751A]">
              Cooking Mode
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Step {currentStep + 1} of {recipe.instructions.length}
            </p>

          </div>

          {/* Progress */}
          <div className="mb-12 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#E8751A] transition-all duration-500"
              style={{
                width: `${((currentStep + 1) /
                    recipe.instructions.length) *
                  100
                  }%`,
              }}
            />
          </div>

          <div className="rounded-l-4xl bg-white p-8 text-center shadow-xl md:p-14">

            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
              👩🏽‍🍳
            </div>

            <h1 className="text-3xl font-bold text-[#164C3A]">
              {instruction.title}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              {instruction.description}
            </p>

            <div className="mt-10 rounded-2xl bg-[#FFF9F0] p-5">
              <p className="text-sm text-gray-500">
                Take your time and follow this step carefully.
              </p>
            </div>

          </div>

          <div className="mt-8 flex items-center justify-between">

            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold disabled:opacity-30"
            >
              ← Previous
            </button>

            {currentStep === recipe.instructions.length - 1 ? (
              <button
                onClick={() => setShowCookingMode(false)}
                className="rounded-xl bg-[#164C3A] px-6 py-3 text-sm font-semibold text-white"
              >
                🎉 Finish Cooking
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="rounded-xl bg-[#E8751A] px-6 py-3 text-sm font-semibold text-white"
              >
                Next →
              </button>
            )}

          </div>

        </div>

      </main>
    );
  }

  return (
    <>
    <Header 
      onBack={onBack}
    />
    
      <main className="min-h-screen bg-[#FFF9F0] px-6 py-10 md:px-12">

      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          onClick={onBack}
          className="mb-8 text-sm font-medium text-gray-600 hover:text-[#164C3A]"
        >
          ← Back to recipes
        </button>

        {/* Header */}
        <section className="grid gap-8 lg:grid-cols-2">

          <div className="flex min-h-100 items-center justify-center rounded-4xl bg-linear-to-br from-green-100 to-orange-100 p-10">

            <div className="text-center">

              <div className="text-8xl">
                <img src={recipe.image} alt={recipe.tittle} /></div>

              {/* <p className="mt-5 text-sm font-medium text-gray-500">
                AI generated recipe
              </p> */}

            </div>

          </div>

          <div className="flex flex-col justify-center">

            <div className="mb-4 flex gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#164C3A]">
                {recipe.cuisine}
              </span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                AI Generated
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-[#164C3A] md:text-5xl">
              {recipe.title}
            </h1>

            <p className="mt-5 leading-7 text-gray-600">
              {recipe.description}
            </p>

            {/* Recipe information */}
            <div className="mt-7 grid grid-cols-3 gap-3">

              <InfoCard
                icon="⏱️"
                label="Cooking"
                value={recipe.cookingTime}
              />

              <InfoCard
                icon="👩🏽‍🍳"
                label="Difficulty"
                value={recipe.difficulty}
              />

              <InfoCard
                icon="👥"
                label="Servings"
                value={recipe.servings}
              />

            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-wrap gap-3">

              <button
                onClick={() => setShowCookingMode(true)}
                className="rounded-xl bg-[#E8751A] px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                ✨ Start Cooking
              </button>

              <button
                onClick={saveRecipe}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700"
              >
                {saved ? "♥ Saved" : "♡ Save Recipe"}
              </button>

              <button className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700"
              onClick={() => setShowShoppingList(true)}
              >
                🛒 Shopping List
              </button>

            </div>

          </div>

        </section>

        {/* Ingredients + instructions */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Ingredients */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-[#164C3A]">
              🛒 Ingredients
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Everything you'll need for this recipe.
            </p>

            <div className="mt-7 space-y-4">

              {recipe.ingredients.map((ingredient, index) => (
                <label
                  key={index}
                  className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-[#FFF9F0]"
                >

                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-[#E8751A]"
                  />

                  <span className="flex-1 text-gray-700">
                    {ingredient.name}
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    {ingredient.quantity}
                  </span>

                </label>
              ))}

            </div>

            <button className="mt-6 w-full rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-700"
              onClick={() =>
              showComingSoon("Add to ingredients feature coming soon!")
              }
            >
              + Add missing ingredients
            </button>

          </div>
          {comingSoonMessage && (
            <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
              <div className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
                {comingSoonMessage}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-[#164C3A]">
              👩🏽‍🍳 Instructions
            </h2>

            <div className="mt-7 space-y-7">

              {recipe.instructions.map((instruction) => (
                <div
                  key={instruction.step}
                  className="flex gap-4"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#164C3A] text-sm font-bold text-white">
                    {instruction.step}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {instruction.title}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-600">
                      {instruction.description}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* Tips */}
        {recipe.tips?.length > 0 && (
          <section className="mt-8 rounded-3xl bg-[#164C3A] p-7 text-white">

            <h2 className="text-xl font-bold">
              💡 PantryPal Tips
            </h2>

            <div className="mt-4 space-y-2">
              {recipe.tips.map((tip, index) => (
                <p
                  key={index}
                  className="text-sm leading-6 text-green-50"
                >
                  • {tip}
                </p>
              ))}
            </div>

          </section>
        )}

      </div>

    </main>

    {showShoppingList && (
  <ShoppingListModal
    recipe={recipe}
    purchasedItems={purchasedItems}
    togglePurchased={togglePurchased}
    copyShoppingList={copyShoppingList}
    copied={copied}
    onClose={() => setShowShoppingList(false)}
  />
)}
    </>
  );
}

function ShoppingListModal({
  recipe,
  purchasedItems,
  togglePurchased,
  copyShoppingList,
  copied,
  onClose,
}) {
  const totalItems = recipe.ingredients.length;
  const purchasedCount = purchasedItems.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>

              <h2 className="text-2xl font-bold text-[#164C3A]">
                Shopping List
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Everything you need for {recipe.title}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>

        </div>


        {/* Progress */}
        <div className="mt-6 rounded-2xl bg-[#FFF9F0] p-4">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-[#164C3A]">
              {purchasedCount} of {totalItems} items purchased
            </p>

            <span className="text-sm font-semibold text-[#E8751A]">
              {totalItems > 0
                ? Math.round((purchasedCount / totalItems) * 100)
                : 0}%
            </span>

          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">

            <div
              className="h-full rounded-full bg-[#E8751A] transition-all duration-300"
              style={{
                width: `${
                  totalItems > 0
                    ? (purchasedCount / totalItems) * 100
                    : 0
                }%`,
              }}
            />

          </div>

        </div>


        {/* Ingredients */}
        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <h3 className="font-semibold text-gray-800">
              Items to buy
            </h3>

            <span className="text-sm text-gray-500">
              {totalItems} items
            </span>

          </div>

          <div className="space-y-2">

            {recipe.ingredients.map((ingredient, index) => {

              const isPurchased = purchasedItems.includes(index);

              return (
                <label
                  key={index}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    isPurchased
                      ? "border-green-200 bg-green-50"
                      : "border-gray-100 hover:bg-[#FFF9F0]"
                  }`}
                >

                  <input
                    type="checkbox"
                    checked={isPurchased}
                    onChange={() => togglePurchased(index)}
                    className="h-5 w-5 accent-[#164C3A]"
                  />

                  <span
                    className={`flex-1 text-sm ${
                      isPurchased
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {ingredient.name}
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    {ingredient.quantity}
                  </span>

                </label>
              );

            })}

          </div>

        </div>


        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={copyShoppingList}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {copied ? "✓ Copied!" : "📋 Copy List"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#164C3A] py-3 text-sm font-semibold text-white transition hover:bg-green-900"
          >
            Done
          </button>

        </div>

      </div>

    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-xl">{icon}</div>

      <p className="mt-2 text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#164C3A]">
        {value}
      </p>
    </div>
  );
}