<script setup lang="ts">
import Slider from 'primevue/slider';
import Dialog from 'primevue/dialog';
import List from './List.vue';

import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { PlaylistDetails } from '@/interfaces';
import { fetcPlaylistsDetails, addSongToPlaylist } from '@/api';
import { songBuffer, isPlaying, audio, togglePlay } from '@/store';

const currentTime = ref<number>(0);
const duration = ref<number>(0);

const playlistsDetails = ref<PlaylistDetails[]>([]);
const dialogVisible = ref<boolean>(false);

const caption = ref<HTMLElement | null>(null);
const captionSpanTitle = ref<HTMLElement | null>(null);
const captionSpanChannel = ref<HTMLElement | null>(null);

onMounted(() => {
    const observer = new ResizeObserver(() => {
        const captionWidth = caption.value?.offsetWidth || 0;
        [captionSpanTitle.value, captionSpanChannel.value].forEach((el) => {
            el?.classList.toggle('marquee-animation', (el?.offsetWidth || 0) > captionWidth);
        });
    });

    [caption.value, captionSpanTitle.value, captionSpanChannel.value]
        .filter(Boolean)
        .forEach((el) => observer.observe(el!));

    onBeforeUnmount(() => observer.disconnect());
});

const initializeAudio = () => {
    if (audio.value) {
        audio.value.pause(); // Pause existing audio if it's playing
        isPlaying.value = false;
    }

    const currSongMp3Url = songBuffer.value.getCurrSongMp3Url();
    if (currSongMp3Url) {
        audio.value = new Audio(currSongMp3Url);
        audio.value.addEventListener('timeupdate', () => {
            currentTime.value = audio.value?.currentTime ?? 0;
            duration.value = audio.value?.duration ?? 0;
        });
        audio.value.play();
        isPlaying.value = true;
    }
}

watch(
    () => songBuffer.value.getCurrSongMp3Url(),
    (mp3Url) => {
        if (mp3Url) initializeAudio();
    }
);

watch(
    currentTime,
    () => {
        currentTime.value === duration.value &&
            songBuffer.value.skipSong(); 
    }
)

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

const showPlaylistsDialog = async () => {
    const userId = 0;
    playlistsDetails.value = (await fetcPlaylistsDetails(userId)) ?? [];
    dialogVisible.value = true;
}

const addCurrSongToPlaylist = async (playlistIndex: number) => {
    const playlistId: number = playlistsDetails.value[playlistIndex].id;
    const currSongDetails = songBuffer.value.getCurrSongDetails();
    currSongDetails && await addSongToPlaylist(currSongDetails, playlistId);
    // const playlist_song_id: number | undefined = currSongDetails ?
    //     await addSongToPlaylist(currSongDetails, playlistId) : undefined;
    dialogVisible.value = false;
}
</script>

<template>
    <div class="song-container">
        {{ captionSpanTitle?.offsetWidth }}
        <img 
            :src="`${songBuffer.getCurrSongDetails()?.base_pic_url}hqdefault.jpg`"
            class="song-image"
        />

        <div class="temp-name">
            <i 
                class="pi pi-plus-circle add-to-playlist"
                @click="showPlaylistsDialog"
            ></i>

            <Dialog
                v-model:visible="dialogVisible"
                header="add song to playlist"
                class="playlists-dialog playlist-list"
            >
                <List
                    :data="playlistsDetails"
                    class="playlists-list"
                    titleAttrName="name"
                    subtitleAttrName="songs_amount"
                    subtitlePrefix="songs amount: "
                    picUrlAttrName="pic_url"
                    @selectItem="addCurrSongToPlaylist"
                />
                <!-- TODO: maybe add confirm dialog after adding song to playlist -->
            </Dialog>
                
            <div ref="caption" class="caption">
                <span ref="captionSpanTitle" class="caption-span title">{{ songBuffer.getCurrSongDetails()?.title }}</span>
                <span ref="captionSpanChannel" class="caption-span channel">{{ songBuffer.getCurrSongDetails()?.channel }}</span>
            </div>
        </div>

        <div class="timeline">
            <Slider 
                v-model="currentTime"
                :step="1"
                :min="0"
                :max="duration"
                @update:model-value="changeCurrentTime"
                class="timeline-slider"
            />
            <div class="show-times">
                <p class="time-text">{{ formatSecondsTime(currentTime) }}</p>
                <p class="time-text">{{ formatSecondsTime(duration) }}</p>
            </div>
        </div>

        <div class="controls">
            <i 
                class="fa-solid fa-backward control-icon" 
                @click="songBuffer.previousSong()"
            />
            <i 
                :class="['play-button', isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play']"
                @click="togglePlay"
            />
            <i 
                class="fa-solid fa-forward control-icon"
                @click="songBuffer.skipSong()"
            />
        </div>
    </div>
</template>

<style scoped>
.song-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
}

.song-image {
    width: 80vw;
    height: 45vh; /* Maintain a 75% height-to-width ratio (3:4 aspect ratio) */
    /* aspect-ratio: 4 / 3; Maintain a 75% height-to-width ratio (3:4 aspect ratio) */
    object-fit: cover; 
    border-radius: 18px;
    margin-top: 1rem;
}

.temp-name {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
}

.add-to-playlist {
    font-size: 1.5rem !important;
    margin-right: 1rem;
    color: #fff;
}

.playlists-dialog {
    width: 80%;
    height: 70%;
}

.title {
    font-size: 1.0rem;
    color: #fff;
    margin: 0;
}

.channel {
    font-size: 0.8rem;
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

.timeline-slider {
    width: 100% !important;
    height: 6px !important;
    background-color: rgba(16, 33, 11, 0.848) !important;
    /* background-color: rgba(16, 33, 11, 0.843) !important; */
    border-radius: 3px !important;
}

.show-times {
    display: flex;
    justify-content: space-between;
}

.time-text {
    color: #929292;
    font-size: smaller;
    margin-top: 5px;
}

.controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2.0rem;
    margin-top: 0.4rem;
}

.control-icon {
    font-size: 1.5rem;
    color: #ffffff;
    cursor: pointer;
}

.play-button {
    width: 2.8rem;
    height: 2.8rem;
    font-size: 1.3rem;
    color: #092e14;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding-left: 0.2rem; */
    background-color: #fff;
    border-radius: 50%;
}

</style>

<style>
.p-slider-range {
    background-color: rgb(123, 131, 120) !important;
    border-radius: 3px !important;
}

.marquee-animation {
    animation: marquee 10s linear infinite;
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    33% {
        transform: translateX(-100%);
    }
    33.01% {
        transform: translateX(100%);
    }
    66% {        
        transform: translateX(0);
    }
    100% {
        transform: translateX(0);
    }
}

/* @keyframes marquee {
    0% {
        transform: translateX(0);
    }
    33% {
        transform: translateX(100%);
    }
    33.01% {
        transform: translateX(-100%);
    }
    66% {        
        transform: translateX(0);
    }
    100% {
        transform: translateX(0);
    }
} */

.caption {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: end;
    /* position: relative; */
}

.caption-span {
    white-space: nowrap;
    overflow: hidden;
    /* animation: marquee 10s linear infinite; */
    color: #fff;
    font-weight: bold;
    padding-top: 0;
    margin-top: 0;
}

.caption-span:hover {
    animation-play-state: paused;
}

</style>