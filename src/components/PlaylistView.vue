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

</script>

<template>
    <main>
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