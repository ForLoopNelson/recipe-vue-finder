import { ref } from "vue";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export function useMeals() {
  const recipes = ref([]);
  const selectedRecipe = ref(null);
  const loading = ref(false);

  const searchRecipes = async (ingredient) => {
    loading.value = true;

    const response = await fetch(
      `${BASE_URL}/filter.php?i=${ingredient}`
    );

    const data = await response.json();

    recipes.value = data.meals || [];
    loading.value = false;
  };

  const getRecipeDetails = async (id) => {
    const response = await fetch(
      `${BASE_URL}/lookup.php?i=${id}`
    );

    const data = await response.json();

    selectedRecipe.value = data.meals?.[0];
  };

  return {
    recipes,
    selectedRecipe,
    loading,
    searchRecipes,
    getRecipeDetails,
  };
}