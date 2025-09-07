import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

export const fetchRecipes = async () => {
  try {
    const response = await instance.get("/recipes/"); // ✅ use instance
    return response.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addRecipe = async (recipe) => {
  const response = await instance.post("/recipes/", recipe);
  return response.data;
};

export const favoriteRecipe = async (id) => {
  const response = await instance.post(`/recipes/${id}/favorite`);
  return response.data;
};

export const fetchFavoriteCount = async (id) => {
  try {
    const response = await instance.get(`/recipes/${id}/favorite-count`);
    return response.data;
  } catch (err) {
    console.error(err);
    return { favorites: 0 };
  }
};
