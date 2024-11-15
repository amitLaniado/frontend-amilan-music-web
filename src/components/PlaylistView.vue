<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { type SongDetails } from '@/interfaces';
import { fetcPlaylistSongsDetails } from '@/api';
import List from '@/components/List.vue';
import SongPlayer from './SongPlayer.vue';
import songBuffer from '@/store';

const props = defineProps(['playlistDetails']);

const songs = ref<SongDetails[]>([]);
const isSelected = ref<boolean>(false);

onMounted(async () => {
    songs.value = (await fetcPlaylistSongsDetails(props.playlistDetails.id)) ?? [];
});

const selectSong = (index: number) => {
  songBuffer.value.setSongs(songs.value, index);
  isSelected.value = true;
}

</script>

<template>
    <main>
        <SongPlayer 
            v-if="isSelected"
        />
            <!-- :song="songs[selectedSongIndex]" -->
            <!-- @end="skipSong" -->
    
        <div v-else>
            <p>Platlist view</p>
    
            <!-- button to play the playlist -->
            <!-- button to shaffle -->
            <List 
                class="songs-list"
                :data="songs"
                titleAttrName="title"
                subtitleAttrName="channel"
                @selectItem="selectSong"
            />
                <!-- @selectItem="(index) => { selectedSongIndex = index; console.log("index = ", index); }" -->
        </div>
    </main>
</template>


<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: hidden;
}

p {
  text-align: center;
}

.songs-list {
  width: 400px;
}
</style>