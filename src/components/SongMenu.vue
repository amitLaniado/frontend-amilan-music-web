<script setup lang="ts">
import { songBuffer, isPlaying, togglePlay } from '@/store';

</script>

<template>
    <div class="container">
        <div class="controls">
            <i 
                class="pi pi-step-backward control-icon"
                @click="songBuffer.previousSong()"
            ></i>
            <i 
                :class="['control-icon', isPlaying ? 'pi pi-pause' : 'pi pi-play']"
                @click="togglePlay"
            ></i>
            <i 
                class="pi pi-step-forward control-icon"
                @click="songBuffer.skipSong()"
            ></i>
        </div>

        <div class="caption">
            <h2 class="title">{{ songBuffer.getCurrSongDetails().title }}</h2>
            <h4 class="subtitle">{{ songBuffer.getCurrSongDetails().channel }}</h4>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    width: 100%;
    overflow-y: hidden;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: aliceblue;
}

.title {
    font-size: 1.5rem;
    margin-bottom: 0;
}
.subtitle {
    font-size: 1rem;
}
</style>