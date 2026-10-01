import { useAuth } from "./AuthContext";

export default function Header({ onGoToRecipes, onBack }) {
  const { user, logout } = useAuth();

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

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8 lg:px-20">

        {/* Logo / Home */}
        <button
          type="button"
          className="text-xl font-bold text-[#164C3A]"
          onClick={onBack}
        >
          🥕 PantryPal AI
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-6">

          {/* Home */}
          <button
            type="button"
            onClick={onBack}
            className="hidden font-medium text-gray-600 transition hover:text-[#E8751A] md:block"
          >
            Home
          </button>

          {/* Saved Recipes */}
          <button
            type="button"
            onClick={onGoToRecipes}
            className="rounded-xl border border-[#E8751A] bg-[#FFF9F0] p-2 text-[12px] font-medium text-[#E8751A] transition hover:bg-[#E8751A] hover:text-white"
          >
            Saved Recipes
          </button>

          {/* User name */}
          <span className="hidden text-sm font-semibold text-[#164C3A] lg:block">
            👋 {userName}
          </span>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-[#164C3A] px-3 py-2 text-[12px] font-medium text-white transition hover:bg-[#123E30]"
          >
            Logout
          </button>

        </nav>
      </div>
    </header>
  );
}