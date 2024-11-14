<script setup lang="ts">
// import Card from 'primevue/card';
import Slider from 'primevue/slider';

import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';

import { type Song } from '@/interfaces';
import { fetchMp3File } from '@/api';

const props = defineProps<{ song: Song }>();
const emit = defineEmits(['end']);

const mp3Url = ref<string>('')
const isPlaying = ref<boolean>(false);
const audio = ref<HTMLAudioElement | null>(null);
const currentTime = ref<number>(0);
const duration = ref<number>(0);

const initializeAudio = async () => {
    audio.value = new Audio(mp3Url.value);
    audio.value.addEventListener('timeupdate', () => {
        currentTime.value = audio.value?.currentTime ?? 0;
        duration.value = audio.value?.duration ?? 0;
    });
    await audio.value.play();
    isPlaying.value = true;
}

const initialize = async () => {
    mp3Url.value = await fetchMp3File(props.song.url) ?? '';
    await initializeAudio();
}

onMounted(async () => {
    URL.revokeObjectURL(mp3Url.value); // Free up memory
    await initialize();
});

watch(
    () => props.song.url,
    async () => {
        console.log('initialize');
        await initialize();
    }
)

watch(
    currentTime,
    () => {
        currentTime.value === duration.value && emit('end'); 
    }
)

const togglePlay = () => {
    if (audio.value) {
        isPlaying.value ? audio.value.pause() : audio.value.play();
        isPlaying.value = !isPlaying.value;
    }
}

const formatSecondsTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

const changeCurrentTime = (value: number | number[]): void => {
    const newTime = Array.isArray(value) ? value[0] : value;
    currentTime.value = newTime;
    if (audio.value) audio.value.currentTime = newTime;
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
            <Slider 
                v-model="currentTime"
                :step="1"
                :min="0"
                :max="duration"
                @update:model-value="changeCurrentTime"
            />
            <div class="show-times">
                <p class="time-text">{{ formatSecondsTime(currentTime) }}</p>
                <p class="time-text">{{ formatSecondsTime(duration) }}</p>
            </div>
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

.show-times {
    display: flex;
    justify-content: space-between;
}

.time-text {
    font-size: smaller;
    margin-top: 5px;
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