<template>
  <div class="app">
    <header>
      <h1>🥗 Recipe Finder</h1>
      <p>Search recipes by ingredient</p>
    </header>

    <div class="search-container">
      <input
        v-model="searchTerm"
        @keyup.enter="handleSearch"
        placeholder="Enter ingredient (chicken, salmon, beef...)"
      />

      <button @click="handleSearch">
        Search
      </button>
    </div>

    <div v-if="loading" class="loading">
      Loading recipes...
    </div>

    <div v-if="recipes.length" class="recipes-grid">
      <div
        v-for="recipe in recipes"
        :key="recipe.idMeal"
        class="recipe-card"
        @click="getRecipeDetails(recipe.idMeal)"
      >
        <img
          :src="recipe.strMealThumb"
          :alt="recipe.strMeal"
        />

        <div class="card-content">
          <h3>{{ recipe.strMeal }}</h3>
        </div>
      </div>
    </div>

    <div v-if="!loading && searched && recipes.length === 0">
      No recipes found.
    </div>

    <div
      v-if="selectedRecipe"
      class="modal-overlay"
      @click="selectedRecipe = null"
    >
      <div
        class="modal"
        @click.stop
      >
        <button
          class="close-btn"
          @click="selectedRecipe = null"
        >
          ✕
        </button>

        <img
          :src="selectedRecipe.strMealThumb"
          :alt="selectedRecipe.strMeal"
        />

        <h2>{{ selectedRecipe.strMeal }}</h2>

        <h3>Ingredients</h3>

<ul class="ingredients-list">
  <li
    v-for="(item, index) in ingredients"
    :key="index"
  >
    <span class="measure">{{ item.measure }}</span>
    <span class="ingredient">{{ item.ingredient }}</span>
  </li>
</ul>

        <h3>Instructions</h3>

<ol class="instructions-list">
  <li
    v-for="(step, index) in instructionSteps"
    :key="index"
  >
    {{ step }}
  </li>
</ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMeals } from "@/composables/useMeals";


const searchTerm = ref("");
const searched = ref(false);

const {
  recipes,
  loading,
  selectedRecipe,
  searchRecipes,
  getRecipeDetails,
} = useMeals();

const handleSearch = async () => {
  searched.value = true;
  await searchRecipes(searchTerm.value);
};

const instructionSteps = computed(() => {
  if (!selectedRecipe.value?.strInstructions) return [];

  return selectedRecipe.value.strInstructions
    .split(". ")
    .filter(step => step.trim())
    .map(step => step.endsWith(".") ? step : step + ".");
});

const ingredients = computed(() => {
  if (!selectedRecipe.value) return [];

  const list = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = selectedRecipe.value[`strIngredient${i}`];
    const measure = selectedRecipe.value[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      list.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }

  return list;
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f5fff5;
  font-family: "Roboto", sans-serif;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  color: #2e7d32;
  font-size: 3rem;
  font-family:"Bodoni Moda SC";
  font-weight: 800;
}

header p {
  color: #666;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-container input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #2e7d32;
  border-radius: 10px;
  font-size: 1rem;
}

.search-container button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 0 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.search-container button:hover {
  background: #1b5e20;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  );
  gap: 1.5rem;
}

.recipe-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.25s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recipe-card:hover {
  transform: translateY(-5px);
}

.recipe-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  color: #2e7d32;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 2rem;
}

.ingredients-list li {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e5e5;
}

.measure {
  min-width: 120px;
  font-weight: 700;
  color: #2e7d32; /* green */
}

.ingredient {
  color: #333;
}

.instructions {
  line-height: 1.8;
  font-size: 1rem;
  color: #333;
  margin-top: 1rem;
}

.instructions-list {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.instructions-list li {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #333;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1rem;
}

.modal {
  background: white;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;

  overflow-y: auto;

  border-radius: 15px;
  padding: 1.5rem;

  position: relative;
}

.modal img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.modal h2 {
  color: #2e7d32;
  margin-bottom: 1rem;
}

.modal h3 {
  margin-bottom: 0.5rem;
}

.close-btn {
  position: absolute;
  right: 15px;
  top: 15px;

  border: none;
  background: #2e7d32;
  color: white;

  width: 35px;
  height: 35px;

  border-radius: 50%;
  cursor: pointer;
}
</style>