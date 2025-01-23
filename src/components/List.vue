<script setup lang="ts">
import Card from 'primevue/card';

import { defineProps } from 'vue';

const props = defineProps(['data', 'titleAttrName', 'subtitleAttrName', 'subtitlePrefix', 'picUrlAttrName', 'picUrlEndpoint', 'cardClass', 'listClass']);
</script>

<template>
    <div :class="['list-container', listClass]">
        <Card
            v-for="(item, index) in data"
            :key="index"
            @click="$emit('selectItem', index)"
            :class="[cardClass]"
        >
            <template #content>
                <div class="custom-card">
                    <img 
                        :src="`${item[picUrlAttrName]}${picUrlEndpoint ? picUrlEndpoint : ''}`"
                        class="card-image"
                    />
                    <div class="song-content">
                        <h3 class="title">{{ item[titleAttrName] }}</h3>
                        <p class="subtitle">{{ `${subtitlePrefix ?? ''}${item[subtitleAttrName]}` }}</p>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<style>
.list-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    width: 100%;
    /* height: 100%; */
}

.playlists-list {
    gap: 10px;
}

.custom-card {
    display: flex;
    align-items: center;
}

.p-card {
    width: 100%;
    background-color: transparent !important;
    cursor: pointer;
    box-shadow: none !important;
}
.p-card-body {
    padding: 10px !important;
    /* padding-inline: 10px !important;
    padding-block: 5px !important; */
    /* gap: 100px !important; */
}

.card-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}
.title {
    font-size: 25px;
    color: #fff;
}
.subtitle {
    font-size: 15px;
    color: #c8c8c8;
}

.playlist-card {
    background-color: rgb(78, 78, 78) !important;
}
</style>