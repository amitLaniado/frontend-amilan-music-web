<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { type Song } from '@/interfaces';
import { fetcPlaylistSongsDetails } from '@/api';
import List from '@/components/List.vue';
import SongPlayer from './SongPlayer.vue';

const props = defineProps(['playlistDetails']);

const songs = ref<Song[]>([]);
const selectedSong = ref<Song | null>(null);

onMounted(async () => {
    songs.value = (await fetcPlaylistSongsDetails(props.playlistDetails.id)) ?? [];
});
</script>

<template>
    <SongPlayer 
        v-if="selectedSong"
        :song="selectedSong"
    />

    <div v-else>
        <p>Platlist view</p>

        <List 
            class="songs-list"
            :data="songs"
            titleAttrName="title"
            subtitleAttrName="channel"
            @selectItem="(song) => selectedSong = song"
        />
    </div>
</template>


<style scoped>
.songs-list {
  display: flex;
  width: 400px;
}
</style>