<script setup lang="ts">
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';

import List from '@/components/List.vue';
import SongPlayer from '@/components/SongPlayer.vue';

import { ref } from 'vue';

import { fetchSongOptions } from '../api';
import type { SongDetails } from '../interfaces';
import { songBuffer } from '@/store';

const searchValue = ref<string>('');
const songs = ref<SongDetails[]>([]);
const isSelected = ref<boolean>(false);

const getSongOptions = async () => {
  const songOptions = await fetchSongOptions(searchValue.value);
  songs.value = songOptions ?? [];
  console.log("songs.value = ", songs.value);
}

const selectSong = (index: number) => {
  songBuffer.value.setSongs([songs.value[index]]);
  isSelected.value = true;
}
</script>

<template>
  <main>
    <div
      class="search-song-container"
    >
      <p class="search-title">Search</p>
      
      <IconField class="custom-iconfield">
        <InputIcon class="pi pi-search search-icon" />
        <InputText 
          v-model="searchValue"
          placeholder="Search song"
          @keypress.enter="getSongOptions"
          class="search-input"
        />
      </IconField>

      <List 
        :data="songs"
        titleAttrName="title"
        subtitleAttrName="channel"
        @selectItem="selectSong"
      />
    </div>

  </main>
</template>

<style scoped>
/* Styling the main container */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: hidden;
}

.search-title {
  text-align: center;
}

/* Styling for IconField */
.custom-iconfield {
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: #f1f3f5; /* Light background color */
  border: 1px solid #d1d9e0; /* Light border */
  border-radius: 10px;       /* Rounded corners */
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

/* Styling for the search icon */
.search-icon {
  font-size: 1.0rem;
  color: #6c757d; /* Subtle color for icon */
}

/* Styling for the input field */
.search-input {
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
  color: #495057; /* Text color */
  font-size: 1rem;
  padding: 0;
}

.search-input::placeholder {
  color: #adb5bd; /* Placeholder color */
}

/* Ensures full-width styling on smaller screens */
/* @media (max-width: 480px) {
  .custom-iconfield {
    width: calc(100% - 40px);
    margin-inline: 20px;
  }
} */
</style>
