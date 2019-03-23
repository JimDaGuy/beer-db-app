<template>
  <div id="Results">
    <div class="results-wrapper">
      <div class="result" v-for="recipe in recipes" v-bind:key="recipe.BeerID">
        <div class="result-info-container">
          <span class="result-name">
            <b>Name:</b>
            {{recipe.Name}}
          </span>
          <span class="result-style">
            <b>Style:</b>
            {{recipe.Style}}
          </span>
          <span class="result-abv">
            <b>ABV:</b>
            {{recipe.abv}}
          </span>
          <ui-button class="result-button" @click="showBeerInfo(recipe)">More Info & Comments</ui-button>
        </div>
        <div class="result-image-container">
          <a :href="externalURL + recipe.URL" target="_blank" class="result-link">
            <img class="result-image" :src="imageURL + recipe.Color">
          </a>
        </div>
      </div>
      <div
        v-if="recipes.length < 1 && searchTerm.length < 3"
      >Enter a value to search. (3 characters minimum)</div>
      <div v-if="recipes.length < 1 && searchTerm.length >= 3">No results found for {{searchTerm}}.</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openModal(ref) {
      this.$refs[ref].open();
    },
    showBeerInfo(recipe) {
      // Clear previous comments
      this.comments = [];
      // Update selected recipe for modal view
      this.selectedRecipe = recipe;

      // Get Comments
      const apiURL = this.apiURL;

      let query = `comments?beerID=${recipe.BeerID}`;
      query = encodeURI(query);

      this.$http
        .get(apiURL + query)
        .then(response => {
          const comments = response.data;
          this.comments = comments;
        })
        .catch(error => {
          console.dir(error);
        });

      // Show modal
      this.$refs["beerInfoModal"].open();
    }
  }
};
</script>

<style>
</style>
