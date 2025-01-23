<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { songBuffer, isPlaying, togglePlay } from '@/store';

const caption = ref<HTMLElement | null>(null);
const captionSpanTitle = ref<HTMLElement | null>(null);
const captionSpanChannel = ref<HTMLElement | null>(null);

onMounted(() => {
    if (caption.value) {
        const captionOffsetWidth = caption.value.offsetWidth;

        if (captionSpanTitle.value && captionSpanTitle.value.offsetWidth > captionOffsetWidth) {
            captionSpanTitle.value.classList.add('marquee-animation');
        }
        if (captionSpanChannel.value && captionSpanChannel.value.offsetWidth > captionOffsetWidth) {
            captionSpanChannel.value.classList.add('marquee-animation');
        }
    }
});

</script>

<template>
    <div class="song-menu-container">
        <i
            :class="['play-button', isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play']"
            @click="togglePlay"
        ></i>

        <div ref="caption" class="caption">
            <span ref="captionSpanTitle" class="caption-span title">{{ songBuffer.getCurrSongDetails()?.title }}</span>
            <span ref="captionSpanChannel" class="caption-span channel">{{ songBuffer.getCurrSongDetails()?.channel }}</span>
        </div>

        <img 
            :src="`${songBuffer.getCurrSongDetails()?.base_pic_url}default.jpg`"
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
.title {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 0;
}
.channel {
    font-size: 0.8rem;
    color: #b5b5b5;
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