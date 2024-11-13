<script setup lang="ts">
import Card from 'primevue/card';

import { defineProps } from 'vue';

const props = defineProps(['data', 'titleAttrName', 'subtitleAttrName', 'subtitlePrefix']);
</script>

<template>
    <div class="container">
        <Card
            v-for="(item, index) in data"
            :key="index"
            @click="$emit('selectItem', item)"
        >
            <template #title>{{ item[titleAttrName] }}</template>
            <template #content>{{ `${subtitlePrefix ?? ''}${item[subtitleAttrName]}` }}</template>
        </Card>
    </div>
</template>

<style>
.container{
    overflow-y: auto;  /* Enable vertical scrolling */
    width: 100%;       /* Full width */
    cursor: pointer;
}
.p-card {
    width: 100%;
    margin-top: 8px;
}
.p-card-body {
    padding: 10px !important;
    gap: 0 !important;
}
.p-card-title {
    font-size: 20px !important;
}
.p-card-content {
    font-size: 10px;
}
</style>