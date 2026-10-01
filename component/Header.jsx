import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Header({
  currentPage = "home",
  onGoToRecipes,
  onBack,
}) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  function isActive(page) {
    return currentPage === page;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 lg:px-20">

        {/* Logo */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xl font-bold text-[#164C3A]"
        >
          <span>🥕</span>
          <span>PantryPal AI</span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-4">

          {/* Home */}
          <button
            type="button"
            onClick={onBack}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isActive("home")
                ? "bg-[#164C3A] text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-[#164C3A]"
            }`}
          >
            Home
          </button>

          {/* Saved Recipes */}
          <button
            type="button"
            onClick={onGoToRecipes}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isActive("saved")
                ? "bg-[#E8751A] text-white"
                : "text-gray-600 hover:bg-[#FFF3E8] hover:text-[#E8751A]"
            }`}
          >
            My Recipes
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive("profile")
                  ? "bg-[#164C3A] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#164C3A]"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF3E8] text-sm">
                👤
              </span>

              <span className="hidden max-w-28 truncate md:block">
                {userName}
              </span>

              <span className="text-xs">⌄</span>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">

                <div className="border-b border-gray-100 px-5 py-4">
                  <p className="font-semibold text-[#164C3A]">
                    {userName}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Profile page will be connected here
                    }}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    👤 Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onGoToRecipes();
                    }}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    📖 My Recipes
                  </button>
                </div>

                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    ↪ Log out
                  </button>
                </div>

              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}