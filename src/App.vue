<template>
  <div class="app">
    <header>
      <h1>🥗 Recipe Finder</h1>
      <p>Search recipes by ingredient</p>
    </header>

    <div class="search-container">
      <input
        v-model="searchTerm"
        @keyup.enter="searchRecipes"
        placeholder="Enter ingredient (chicken, salmon, beef...)"
      />

      <button @click="searchRecipes">
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

        <h3>Instructions</h3>

        <p>{{ selectedRecipe.strInstructions }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchTerm = ref("");
const recipes = ref([]);
const loading = ref(false);
const searched = ref(false);
const selectedRecipe = ref(null);

const searchRecipes = async () => {
  if (!searchTerm.value.trim()) return;

  loading.value = true;
  searched.value = true;

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm.value}`
    );

    const data = await response.json();

    recipes.value = data.meals || [];
  } catch (error) {
    console.error(error);
    recipes.value = [];
  }

  loading.value = false;
};

const getRecipeDetails = async (id) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await response.json();

    selectedRecipe.value = data.meals[0];
  } catch (error) {
    console.error(error);
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f5fff5;
  font-family: Arial, sans-serif;
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