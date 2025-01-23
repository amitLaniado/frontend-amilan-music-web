<script setup lang="ts">
import {ref} from 'vue';
import { RouterLink, RouterView } from 'vue-router';

import { Dialog } from 'primevue';

import { showSongPlayer, songBuffer } from './store';
import SongPlayer from './components/SongPlayer.vue';
import SongMenu from './components/SongMenu.vue';

const routerItems = [
  {
    "path": "/",
    "icon": "pi pi-home",
    "text": "Home"
  },
  {
    "path": "/search",
    "icon": "pi pi-search",
    "text": "Search"
  },
  {
    "path": "/library",
    "icon": "pi pi-bookmark",
    "text": "Library"
  },
]

const selectedRouterItemIndex = ref(0);
</script>

<template>
  <div class="container">
    <RouterView/>

    <Dialog
      v-model:visible="showSongPlayer"
      position="bottom"
      class="song-player-dialog"
    >
      <SongPlayer />
    </Dialog>

    <div class="bottom-things">
      <!-- TODO: maybe it better to put here v-show instead v-if  -->
      <SongMenu 
        v-if="songBuffer.isEmpty() && !showSongPlayer"
        class="song-menu"
        @click="() => showSongPlayer = true"
      />

      <nav class="navbar">
        <RouterLink 
          v-for="(item, index) in routerItems"
          :key="item.path"
          class="router-item"
          :to="item.path"
          :class="['router-item', selectedRouterItemIndex === index ? 'selected-router-item' : '']"  
          @click="selectedRouterItemIndex = index"
        >
          <!-- <span :class="['router-item-icon', item.icon]" style="--icon-fill-color: red !important;"></span> -->
          <!-- <span :class="['router-item-icon', item.icon]" style="--icon-fill-color: red !important"></span> -->
          <span :class="['router-item-icon', item.icon]"></span>
          <p class="router-item-text">{{ item.text }}</p>
        </RouterLink>
      </nav>  
    </div>
  </div>
</template>

<!-- <style>

</style> -->
<style>
* {
  padding: 0;
  margin: 0;
}

/* Hide scrollbar for Chrome, Safari and Opera */
*::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

body {
  background-color: #121212;
  /* overflow: hidden; */
}

.song-player-dialog {
  width: 100vw;
  height: 100vh;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  background: linear-gradient(180deg, #0e431d, #121212) !important;
}

.p-dialog {
  max-height: 100% !important;
}

.bottom-things {
  position: fixed;
  bottom: 0;
  width: 100%;
}

main {
  display: flex;
  flex-direction: column;
  padding: 50px 40px 0px;
}

.page-title {
  color: #fff;
  text-align: left;
  font-size: 1.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  margin-bottom: 30px;
}

/* .song-menu {
  width: 100vw;
} */

.navbar {
  display: flex;
  justify-content: space-around;
  background-color: rgba(24, 24, 24, 0.95); /* Optional: set background color */
  backdrop-filter: blur(10px); /* Optional for a frosted-glass effect */
  padding: 10px 0;         /* Optional: add padding for spacing */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.7); /* Creates separation */
}

.router-item {
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  gap: 0.2rem;
}
.router-item-icon {
  font-size: 1rem !important;
}
.router-item-text {
  font-size: 0.5rem;
}
.router-item:active {
  transform: scale(1.1);
}
.selected-router-item {
  color: #fff !important;
}

</style>
