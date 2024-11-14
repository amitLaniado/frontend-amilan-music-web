<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { type Song } from '@/interfaces';
import { fetcPlaylistSongsDetails } from '@/api';
import List from '@/components/List.vue';
import SongPlayer from './SongPlayer.vue';

const props = defineProps(['playlistDetails']);

const songs = ref<Song[]>([]);
const selectedSongIndex = ref<number | null>(null);

onMounted(async () => {
    songs.value = (await fetcPlaylistSongsDetails(props.playlistDetails.id)) ?? [];
});

const skipSong = () => {
    selectedSongIndex.value !== null && 
        songs.value.length > selectedSongIndex.value && 
        selectedSongIndex.value++;
}
</script>

<template>
    <SongPlayer 
        v-if="selectedSongIndex !== null"
        :song="songs[selectedSongIndex]"
        @end="skipSong"
    />

    <div v-else>
        <p>Platlist view</p>

        <List 
            class="songs-list"
            :data="songs"
            titleAttrName="title"
            subtitleAttrName="channel"
            @selectItem="(index) => selectedSongIndex = index"
        />
            <!-- @selectItem="(index) => { selectedSongIndex = index; console.log("index = ", index); }" -->
    </div>
</template>


<style scoped>
.songs-list {
  width: 400px;
}
</style>