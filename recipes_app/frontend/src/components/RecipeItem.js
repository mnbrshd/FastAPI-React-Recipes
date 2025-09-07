export default function RecipeItem({ recipe, onFavorite }) {
  return (
    <li className="recipe-item">
      <h3>{recipe.title}</h3>
      <p>Ingredients: {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : recipe.ingredients}</p>
      <p>Instructions: {recipe.instructions}</p>

      {/* Favorite button */}
      <button onClick={() => onFavorite(recipe.id)}>
        {recipe.is_favorite ? "Unfavorite" : "Favorite"}
      </button>

      {/* Global favorite count */}
      <span style={{ marginLeft: "10px" }}>
        ❤️ {recipe.favorite_count || 0}
      </span>
    </li>
  );
}
