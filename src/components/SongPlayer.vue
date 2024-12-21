<script setup lang="ts">
// import Card from 'primevue/card';
import Slider from 'primevue/slider';
import Dialog from 'primevue/dialog';
import List from './List.vue';

import { ref, watch } from 'vue';

import type { PlaylistDetails } from '@/interfaces';
import { fetcPlaylistsDetails, addSongToPlaylist } from '@/api';
import { songBuffer, isPlaying, audio, togglePlay } from '@/store';

const currentTime = ref<number>(0);
const duration = ref<number>(0);

const playlistsDetails = ref<PlaylistDetails[]>([]);
const dialogVisible = ref<boolean>(false);

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
    const playlist_song_id: number | undefined = 
        await addSongToPlaylist(songBuffer.value.getCurrSongDetails(), playlistId);
    dialogVisible.value = false;
}
</script>

<template>
    <div class="song-container">
        <div class="img-placeholder"></div>

        <div class="temp-name">
            <i 
                class="pi pi-plus-circle add-to-playlist"
                @click="showPlaylistsDialog"
            ></i>

            <!-- TODO: put this dialog in new component -->
            <Dialog
                v-model:visible="dialogVisible"
                header="add song to playlist"
                class="playlists-dialog"
            >
                <List
                    :data="playlistsDetails"
                    class="playlists-list"
                    titleAttrName="name"
                    subtitleAttrName="songs_amount"
                    subtitlePrefix="songs amount: "
                    @selectItem="addCurrSongToPlaylist"
                />
                <!-- TODO: maybe add confirm dialog after adding song to playlist -->
            </Dialog>
                
            <div class="caption">
                <h2 class="title">{{ songBuffer.getCurrSongDetails().title }}</h2>
                <h4 class="subtitle">{{ songBuffer.getCurrSongDetails().channel }}</h4>
            </div>
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

.temp-name {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.add-to-playlist {
    padding-top: 0.6rem;
    font-size: 1.5rem !important;
    margin-right: 5%;
}

.playlists-dialog {
    width: 80%;
    height: 70%;
}
.p-dialog-header {
    padding-block: 0.5rem 0 !important;
}
/* .p-button-icon {
    padding: 0 !important;
    margin: 0 !important;
}
 */
.caption {
    text-align: right;
}

.caption .title {
    width: 100%;
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 0;
    margin-top: 0;
    /* margin-inline: 0; */
    margin-left: auto;
    margin-bottom: 0.3rem;
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