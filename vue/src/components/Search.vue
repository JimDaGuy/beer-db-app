<template>
  <div id="search">
    <div class="search-wrapper">
      <input
        class="search-input"
        type="text"
        v-model="searchTerm"
        v-on:input="performSearch"
        placeholder="   Search For A Beer Name..."
      >
    </div>

    <!--Attempting to port over -->
    <div class="results-wrapper">
      <div v-if="recipes.length >= 1 && searchTerm.length >= 3">Showing results for {{searchTerm}}</div>
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
            {{recipe.ABV}}
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
    <!--Attempting to port over ^^^^^^^-->
    <div class="pagination-container">
      <span class="page-num" v-if="recipes.length !== 0 || pageNum !== 1">Page: {{pageNum}}</span>
      <ui-button class="prev-page" @click="changePage(false)" v-if="pageNum > 1">Previous Page</ui-button>
      <ui-button class="next-page" @click="changePage(true)" v-if="recipes.length === 5">Next Page</ui-button>
    </div>
    <ui-modal ref="beerInfoModal" class="beer-modal" color="accent" title="Beer Info">
      <span class="beer-info-name">
        <b>Name:</b>
        {{selectedRecipe.Name || ''}}
      </span>
      <span class="beer-info-style">
        <b>Style:</b>
        {{selectedRecipe.Style || ''}}
      </span>
      <span class="beer-info-original-grav">
        <b>Original Gravity:</b>
        {{selectedRecipe.OG || ''}}
      </span>
      <span class="beer-info-final-grav">
        <b>Final Gravity:</b>
        {{selectedRecipe.FG || ''}}
      </span>
      <span class="beer-info-abv">
        <b>ABV:</b>
        {{selectedRecipe.ABV || ''}}
      </span>
      <span class="beer-info-ibu">
        <b>IBU:</b>
        {{selectedRecipe.IBU || ''}}
      </span>
      <span class="beer-info-color">
        <b>Color:</b>
        {{selectedRecipe.Color || ''}}
      </span>
      <a :href="externalURL + selectedRecipe.URL" target="_blank">
        <span class="beer-info-external">External URL</span>
      </a>
      <img class="result-image" :src="this.imageURL + selectedRecipe.Color">
      <div class="comments-container">
        <h2 class="comment-header">Comments</h2>
        <div class="comment-container" v-for="comment in comments" v-bind:key="comment._id">
          <span class="comment-span">{{comment.comment}}</span>
        </div>
        <div v-if="comments.length < 1">No comments found for this beer. You can leave the first!</div>
        <input class="comment-input" type="text" v-model="currentComment" placeholder="Comment...">
        <ui-button @click="submitComment" style="padding: 20px">Submit</ui-button>
      </div>
    </ui-modal>
  </div>
</template>

<script>
export default {
  name: "Search",
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
    },
    submitComment() {
      const beerID = this.selectedRecipe.BeerID;
      const comment = this.currentComment;

      if (comment.length < 1) return;

      // Send Comment
      const apiURL = this.apiURL;

      let query = `comment?beerID=${beerID}&comment=${comment}`;
      query = encodeURI(query);

      this.$http
        .post(apiURL + query)
        .then(() => {
          let query2 = `comments?beerID=${beerID}`;
          query2 = encodeURI(query2);

          this.$http
            .get(apiURL + query2)
            .then(response2 => {
              const comments = response2.data;
              this.comments = comments;
            })
            .catch(error2 => {
              console.dir(error2);
            });
        })
        .catch(error => {
          console.dir(error);
        });

      this.currentComment = "";
    },
    performSearch() {
      // Reset page num
      this.pageNum = 1;

      const apiURL = this.apiURL;
      const search = this.searchTerm;
      const pageNum = this.pageNum;
      const numResults = this.numResults;

      // Only search terms longer than three characters
      if (search.length >= 3) {
        let query = `findRecipeByName?name=${search}&rpp=${numResults}&page=${pageNum}`;
        query = encodeURI(query);

        this.$http
          .get(apiURL + query)
          .then(response => {
            const results = response.data;
            this.recipes = results;
          })
          .catch(error => {
            console.dir(error);
          });
      }
    },
    changePage(positive) {
      if (positive) this.pageNum++;
      else this.pageNum--;

      if (this.pageNum < 1) this.pageNum = 1;

      const apiURL = this.apiURL;
      const search = this.searchTerm;
      const pageNum = this.pageNum;
      const numResults = this.numResults;

      // Only search terms longer than three characters
      if (search.length >= 3) {
        let query = `findRecipeByName?name=${search}&rpp=${numResults}&page=${pageNum}`;
        query = encodeURI(query);

        this.$http
          .get(apiURL + query)
          .then(response => {
            const results = response.data;
            this.recipes = results;
          })
          .catch(error => {
            console.dir(error);
          });
      }
    }
  },
  data: () => {
    return {
      apiURL: "https://beerdbapi.herokuapp.com/",
      imageURL: "https://beerdbapi.herokuapp.com/image?color=",
      externalURL: "https://www.brewersfriend.com",
      searchTerm: "",
      currentBeerID: "",
      currentComment: "",
      pageNum: 1,
      numResults: 5,
      selectedRecipe: {},
      recipes: [],
      comments: []
    };
  },
  components: {}
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Pacifico");

.search-wrapper {
  width: 100%;
  height: auto;
  overflow: auto;
}

.search-label {
  padding-top: 30px;
  height: 40%;
  width: auto;
  margin-left: 5%;
  font-size: 20px;
  clear: both;
}

.search-input {
  display: block;
  clear: both;
  margin-left: auto;
  margin-right: 20%;
  width: 60%;
  height: 3em;
  font-size: 150%;
}

.results-wrapper {
  width: 60%;
  margin: 10px auto;
  margin-right: 20%;
  margin-bottom: 3%;
}

.result {
  width: 100%;
  padding: 5px;
  margin: 0 auto 2px auto;
  border: 1px solid black;
  display: flex;
  align-items: flex-start;
  background-color: white;
  color: #43464b;
}

.result-info-container {
  width: calc(100% - 150px);
}

.beer-modal {
  color: black;
}

.result-name {
  float: left;
  clear: both;
}

.result-style {
  float: left;
  clear: left;
}

.result-abv {
  float: left;
  clear: left;
}

.result-button {
  float: left;
  clear: left;
  position: relative;
}

.result-image-container {
  width: 150px;
  height: 150px;
}

.result-link {
  overflow: auto;
}

.result-image {
  height: auto;
  width: 100%;
  background-color: white;
  border-radius: 50%;
}

.pagination-container {
  width: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.page-num {
  width: 100%;
  text-align: center;
}

.prev-page {
  margin: 10px auto;
}

.next-page {
  margin: 10px auto;
}

[class^="beer-info"] {
  float: left;
  clear: left;
  width: 50%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  margin-left: 20%;
}

.comments-container {
  margin-left: 5%;
  margin-bottom: 2%;
  margin-right: 5%;
}

.comment-container {
  height: 20px;
  border: 1px solid gray;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.comment-span {
  font-weight: 700;
}
</style>
