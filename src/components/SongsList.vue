<script setup lang="ts">
import Card from 'primevue/card';

import { defineProps } from 'vue';

const props = defineProps(['songs']);
</script>

<template>
    <div class="songs-container">
        <Card
            v-for="song in songs"
            :key="song.url"
            @click="$emit('selectSong', song)"
        >
            <template #title>{{ song.title }}</template>
            <template #content>{{ song.channel }}</template>
        </Card>
    </div>
</template>

<style>
.songs-container{
    /* max-height: 70%; Set a max height for the scrollable container */
    overflow-y: auto;  /* Enable vertical scrolling */
    width: 100%;       /* Full width */
    cursor: pointer;
}
.p-card {
    width: 100%;
    margin-top: 8px;
}
.p-card-body {
    padding: 10px !important;
    gap: 0 !important;
}
.p-card-title {
    font-size: 20px !important;
}
.p-card-content {
    font-size: 10px;
}
</style>