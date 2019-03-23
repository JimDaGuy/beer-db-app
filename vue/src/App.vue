<template>
  <div id="app">
    <Header/>
    <Search/>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Search from "./components/Search.vue";

export default {
  name: "app",
  methods: {
    openModal(ref) {
      this.$refs[ref].open();
    }
  },
  components: {
    Header,
    Search
  }
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
}

html {
}

body {
  min-width: 350px;
}

header {
  min-height: 200px;
}
</style>
