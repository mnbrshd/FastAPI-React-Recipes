import React, { useEffect, useState } from "react";
import { fetchRecipes, addRecipe, favoriteRecipe, fetchFavoriteCount } from "../api";
import RecipeItem from "./RecipeItem";
import "./RecipeList.css";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    loadRecipes();
  }, []);

  // Fetch all recipes and their favorite counts
  const loadRecipes = async () => {
    const data = await fetchRecipes();

    // Fetch global favorite counts for each recipe
    const counts = await Promise.all(
      data.map(async (recipe) => {
        const countData = await fetchFavoriteCount(recipe.id);
        return { id: recipe.id, count: countData.favorites };
      })
    );

    // Merge favorite counts into recipes
    const recipesWithCounts = data.map((recipe) => {
      const countObj = counts.find(c => c.id === recipe.id);
      return { ...recipe, favorite_count: countObj ? countObj.count : 0 };
    });

    setRecipes(recipesWithCounts);
  };

  const handleAdd = async () => {
    if (!title || !ingredients || !instructions) return;
    await addRecipe({ title, ingredients, instructions });
    setTitle(""); setIngredients(""); setInstructions("");
    loadRecipes();
  };

  const handleFavorite = async (id) => {
    try {
      await favoriteRecipe(id); // toggle in backend
      // Update local state immediately
      setRecipes(prev =>
        prev.map(r =>
          r.id === id
            ? { 
                ...r, 
                is_favorite: !r.is_favorite,
                favorite_count: r.is_favorite ? r.favorite_count - 1 : r.favorite_count + 1
              }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to favorite recipe:", err);
    }
  };

  return (
    <div className="recipe-list-container">
      <h2>Add New Recipe</h2>
      <div className="add-recipe-form">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Ingredients (comma separated)" value={ingredients} onChange={e => setIngredients(e.target.value)} />
        <input placeholder="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
        <button onClick={handleAdd}>Add Recipe</button>
      </div>

      <h2>Your Recipes</h2>
      <ul className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              onFavorite={handleFavorite}
            />
          ))
        ) : (
          <p>No recipes yet. Add one above!</p>
        )}
      </ul>
    </div>
  );
}
