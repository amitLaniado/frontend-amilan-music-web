<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { type SongDetails } from '@/interfaces';
import { fetcPlaylistSongsDetails } from '@/api';
import List from '@/components/List.vue';
import { songBuffer, showSongPlayer } from '@/store';

const props = defineProps(['playlistDetails']);

const songs = ref<SongDetails[]>([]);

onMounted(async () => {
    songs.value = (await fetcPlaylistSongsDetails(props.playlistDetails.id)) ?? [];
});

const selectSong = (index: number) => {
  songBuffer.value.setSongs(songs.value, index);
  showSongPlayer.value = true;
}

const shuffle = (array: any[]) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;  
}; 

const shufflePlaylist = () => {
  songs.value = shuffle(songs.value);
}

</script>

<template>
  <div class="playlist-view-container">
    <div class="playlist-header">
      <h3 class="songs-amount">{{ songs.length }} songs</h3>
  
      <div class="playlist-controls">
        <i 
          class="fa-solid fa-play play-button" 
          @click="selectSong(0)"
        />

        <i
          class="fa-solid fa-shuffle shuffle-button" 
          @click="shufflePlaylist"
        />
      </div>
    </div>
    <!-- button to play the playlist -->
    <!-- button to shaffle -->
    <List 
      class="songs-list"
      :data="songs"
      titleAttrName="title"
      subtitleAttrName="channel"
      picUrlAttrName="base_pic_url"
      picUrlEndpoint="default.jpg"
      @selectItem="selectSong"
    />
  </div>
</template>


<style scoped>
.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.playlist-controls {
  display: flex;
  margin-right: 1rem;
  align-items: center;
}
.play-button {
  width: 2.8rem;
  height: 2.8rem;
  font-size: 1.3rem;
  color: #fff;
  margin-right: 0.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #508b3c;
  border-radius: 50%;
}
.shuffle-button {
  font-size: 1.2rem;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}

.songs-amount {
  color: #fff;
  font-size: 1.5rem !important;
}

/* .songs-list {
  overflow-y: auto;
  flex-grow: 1;
} */
</style>