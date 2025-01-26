<script setup lang="ts">
import Slider from 'primevue/slider';
import Dialog from 'primevue/dialog';
import List from '../List.vue';

import { ref, watch, defineModel } from 'vue';
import type { Ref } from 'vue';

import type { PlaylistDetails } from '@/interfaces';
import { fetcPlaylistsDetails } from '@/api';
import { songBuffer, songPlayer } from '@/store';

import Caption from './Caption.vue';

const showNextSongs = defineModel('showNextSongs');

const currentTime: Ref<number> = ref<number>(0);
const duration: Ref<number> = ref<number>(0);

const playlistsDetails = ref<PlaylistDetails[]>([]);
const dialogVisible = ref<boolean>(false);

watch(songPlayer, () => {
    const songPlayerValue = songPlayer.value;
    if (songPlayerValue) {
        currentTime.value = songPlayerValue.getCurrentTime();
        duration.value = songPlayerValue.getDuration();
    }
}, { deep: true });

const formatSecondsTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

const changeCurrentTime = (value: number | number[]): void => {
    const newTime = Array.isArray(value) ? value[0] : value;
    songPlayer.value?.seekToTime(newTime);
}

const showPlaylistsDialog = async () => {
    const userId = 0;
    playlistsDetails.value = (await fetcPlaylistsDetails(userId)) ?? [];
    dialogVisible.value = true;
}

const addCurrSongToPlaylist = async (playlistIndex: number) => {
    const playlistId: number = playlistsDetails.value[playlistIndex].id;
    await songPlayer.value?.addSongToPlaylist(playlistId);
    dialogVisible.value = false;
}

const skipToSong = async (index: number) => 
    await songBuffer.skipToSong(index);
</script>

<template>
    <div
        v-if="showNextSongs" 
        class="next-songs-list"
    >
        <div class="current-song-section">
            <h3 class="section-text">Current Song</h3>
            <List
                :data="[songPlayer?.getSongDetails() || []]"
                class="current-song"
                titleAttrName="title"
                subtitleAttrName="channel"
                picUrlAttrName="base_pic_url"
                picUrlEndpoint="default.jpg"
            />
        </div>

        <div class="next-songs-section">
            <h3 class="section-text">Next Songs</h3>
            <List
                :data="songBuffer.getNextSongsDetails()"
                class="next-songs"
                titleAttrName="title"
                subtitleAttrName="channel"
                picUrlAttrName="base_pic_url"
                picUrlEndpoint="default.jpg"
                @selectItem="(index) => skipToSong(index + 1)"
            />
        </div>
    </div>
    <div
        v-else
        class="song-player-container"
    >
        <img 
            :src="`${songPlayer?.getPicUrl()}hqdefault.jpg`"
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
                
            <Caption channel-text-color="#666" />
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
                <!-- <p class="time-text">{{ formatSecondsTime(songPlayer?.getCurrentTime() || 0) }}</p>
                <p class="time-text">{{ formatSecondsTime(songPlayer?.getDuration() || 0)}}</p> -->
                <p class="time-text">{{ formatSecondsTime(currentTime) }}</p>
                <p class="time-text">{{ formatSecondsTime(duration)}}</p>
            </div>
        </div>

        <div class="controls">
            <i 
                class="fa-solid fa-backward control-icon" 
                @click="songBuffer.previousSong()"
            />
            <i 
                :class="['play-button', songPlayer?.getIsPlaying() ? 'fa-solid fa-pause' : 'fa-solid fa-play']"
                @click="songPlayer?.togglePlay()"
            />
            <i 
                class="fa-solid fa-forward control-icon"
                @click="songBuffer.skipSong()"
            />
        </div>
    </div>
</template>

<style scoped>
.song-player-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
}

.section-text {
    color: #fff;
    font-size: 1.2rem;
    margin: 0;
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
    background-color: #fff;
    border-radius: 50%;
}

</style>

<style>
.p-slider-range {
    background-color: rgb(123, 131, 120) !important;
    border-radius: 3px !important;
}
</style>