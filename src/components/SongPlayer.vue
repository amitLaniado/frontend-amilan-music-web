<script setup lang="ts">
import Card from 'primevue/card';

import { defineProps, ref, onMounted } from 'vue';

import { fetchMp3File } from '@/api.ts';

const props = defineProps(['song']);
// song = { title, channel, url }

const mp3Url = ref<String>('')
const isPlaying = ref(false);

onMounted(async () => {
    URL.revokeObjectURL(mp3Url.value); // Free up memory
    mp3Url.value = await fetchMp3File(props.song.url);
});

function togglePlay() {
    isPlaying.value = !isPlaying.value;
}

</script>

<template>
    <div class="song-container">
        <div class="img-placeholder"></div>

        <div class="caption">
            <h2 class="title">{{ song.title }}</h2>
            <h4 class="subtitle">{{ song.channel }}</h4>
        </div>

        <div class="timeline">
            <!-- Add a PrimeVue progress bar or slider if desired -->
        </div>

        <div class="controls">
            <i class="pi pi-step-backward control-icon"></i>
            <i 
                :class="['control-icon', isPlaying ? 'pi pi-pause' : 'pi pi-play']"
                @click="togglePlay"
            ></i>
            <i class="pi pi-step-forward control-icon"></i>
        </div>
    </div>

    <!-- Audio player to play the MP3 file -->
    <audio v-if="mp3Url" :src="mp3Url" controls></audio>

</template>

<style>
.song-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
}

.img-placeholder {
    width: 300px;
    height: 300px;
    background-color: #e0e0e0;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.caption .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
}

.caption .subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
}

.timeline {
    width: 100%;
    height: 6px;
    background-color: #ddd;
    border-radius: 3px;
    margin: 1rem 0;
    position: relative;
}

.controls {
    display: flex;
    justify-content: center;
    gap: 2.0rem;
    margin-top: 1rem;
}

.control-icon {
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
}

.control-icon:hover {
    color: #333;
}
</style>