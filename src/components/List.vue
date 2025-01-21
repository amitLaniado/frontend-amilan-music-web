<script setup lang="ts">
import Card from 'primevue/card';

import { defineProps } from 'vue';

const props = defineProps(['data', 'titleAttrName', 'subtitleAttrName', 'subtitlePrefix']);
</script>

<template>
    <div class="cards-list">
        <Card
            v-for="(item, index) in data"
            :key="index"
            @click="$emit('selectItem', index)"
        >
            <template #title>{{ item[titleAttrName] }}</template>
            <template #content>{{ `${subtitlePrefix ?? ''}${item[subtitleAttrName]}` }}</template>
        </Card>
    </div>
</template>

<style>
.cards-list {
    overflow-y: auto;  /* Enable vertical scrolling */
    width: 100%;       /* Full width */
}
.p-card {
    width: 100%;
    background-color: transparent !important;
    cursor: pointer;
}
.p-card-body {
    padding: 10px !important;
    gap: 0 !important;
}
.p-card-title {
    font-size: 20px !important;
    color: #fff;
}
.p-card-content {
    font-size: 14px;
    color: #c0c0c0;
}
</style>