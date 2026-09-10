export default function IngredientsList({ ingredients }) {
  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
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

          <span className="text-sm text-gray-500">
            {ingredient.quantity}
          </span>
        </label>
      ))}
    </div>
  );
}