export default function Header({ onGoToRecipes}) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-20 py-5">

        {/* Logo */}
        <button
          type="button"
          className="text-xl font-bold text-[#164C3A]"
        >
          🥕 PantryPal AI
        </button>

        {/* Navigation */}
        <nav className=" items-center gap-8 flex">
          <button
            type="button"
            onClick={onGoToRecipes}
            className="font-medium border p-2 text-[12px] bg-[#FFF9F0]  text-[#E8751A] rounded-xl transition"
          >
            Saved Recipe
          </button>
        </nav>
        
      </div>
    </header>
  );
}