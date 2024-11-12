<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="container">
    <RouterView />

    <nav>
      <RouterLink class="router-item" to="/">
        <span class="pi pi-home"></span>
        <p>Home</p>
      </RouterLink>
      <RouterLink class="router-item" to="/search">
        <span class="pi pi-search"></span>
        <p>Search</p>
      </RouterLink>
      <RouterLink class="router-item" to="/library">
        <span class="pi pi-bookmark"></span>
        <p>Library</p>
      </RouterLink>
    </nav>  
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: white; /* Optional: set background color */
  padding: 10px 0;         /* Optional: add padding for spacing */
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1); /* Optional: shadow for separation */
}

.router-item {
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

</style>
