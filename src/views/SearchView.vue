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
  </main>
</template>

<style scoped>
/* Styling the main container */
main {
  display: flex;
  flex-direction: column;
  padding: 50px 40px 0px;
  overflow-y: hidden;
}

.search-title {
  color: #fff;
  text-align: left;
  font-size: 1.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  margin-bottom: 30px;
}

/* Styling for IconField */
.custom-iconfield {
  background-color: #1F1F1F;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  padding: 10px 0;
  margin-bottom: 15px;
}

.search-icon {
  padding-left: 10px;
  font-size: 1.4rem;
  transform: translateY(-15%);
  color: #fff; 
}

/* Styling for the input field */
.search-input {
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
  color: #fff;
  font-size: 1.4rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-left: 10px;
}

.search-input::placeholder {
  color: #adb5bd; /* Placeholder color */
}

</style>
