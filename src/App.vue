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
