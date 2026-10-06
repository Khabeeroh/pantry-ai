import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Header({
  currentPage = "home",
  onGoToRecipes,
  onBack,
  onGoToProfile,
}) {
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  function isActive(page) {
    return currentPage === page;
  }

  async function handleLogout() {
    try {
      await logout();
      setShowMobileMenu(false);
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  function handleHome() {
    setShowMobileMenu(false);
    onBack();
  }

  function handleRecipes() {
    setShowMobileMenu(false);
    onGoToRecipes();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 lg:px-20">

        {/* Logo */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-lg font-bold text-[#164C3A] sm:text-xl"
        >
          <span>🥕</span>
          <span>PantryPal AI</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">

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

          {/* My Recipes */}
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
              onClick={() => {
                setShowMobileMenu(false);
                onGoToProfile();
              }}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive("profile")
                  ? "bg-[#164C3A] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#164C3A]"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF3E8]">
                👤
              </span>

              <span className="max-w-28 truncate">
                {userName}
              </span>

              <span className="text-xs">⌄</span>
            </button>

            {/* Desktop Profile Dropdown */}
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
                      onGoToProfile();
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-xl text-[#164C3A] transition hover:bg-gray-50 md:hidden"
          aria-label="Toggle menu"
        >
          {showMobileMenu ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-sm md:hidden">

          {/* User information */}
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-[#FFF9F0] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              👤
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-[#164C3A]">
                {userName}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Home */}
          <button
            type="button"
            onClick={handleHome}
            className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              isActive("home")
                ? "bg-[#164C3A] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            🏠 Home
          </button>

          {/* My Recipes */}
          <button
            type="button"
            onClick={handleRecipes}
            className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              isActive("saved")
                ? "bg-[#E8751A] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            📖 My Recipes
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() => {
              setShowMobileMenu(false);
              // Profile page will be connected here
            }}
            className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              isActive("profile")
                ? "bg-[#164C3A] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            👤 Profile
          </button>

          {/* Logout */}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              ↪ Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}