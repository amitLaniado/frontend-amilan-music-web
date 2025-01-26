<script setup lang="ts">
import { songPlayer } from '@/store';
import Caption from './Caption.vue';

</script>

<template>
    <div class="song-menu-container">
        <i
            :class="['play-button', songPlayer?.getIsPlaying() ? 'fa-solid fa-pause' : 'fa-solid fa-play']"
            @click="songPlayer?.togglePlay()"
        ></i>

        <Caption channel-text-color="#b5b5b5" />

        <img 
            :src="`${songPlayer?.getPicUrl()}default.jpg`"
            class="song-image"
        />
    </div>
</template>

<style scoped>
.song-menu-container {
    display: flex;
    /* width: 100%; */
    overflow-y: hidden;
    justify-content: space-between;
    align-items: center;
    padding-block: 10px;
    background-color: rgb(88, 88, 88);
    margin-inline: 1rem;
    border-radius: 0.4rem;
}

.song-image {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    margin-right: 10px;
    margin-left: 10px;
}

.play-button {
    color: #fff;
    margin-inline: 1.0rem;
    cursor: pointer;
    pointer-events: auto;
}
.play-button:hover {
    pointer-events: auto;
}
</style>