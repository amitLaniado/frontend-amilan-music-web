<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue';
import { songPlayer } from '@/store';

const props = defineProps({
    channelTextColor: String,
});

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
</script>

<template>
    <div ref="caption" class="caption">
        <span ref="captionSpanTitle" class="caption-span title">{{ songPlayer?.getTitle() }}</span>
        <span 
            ref="captionSpanChannel"
            class="caption-span channel"
            :style="{ color: props.channelTextColor }"
        >{{ songPlayer?.getChannel() }}</span>
    </div>
</template>

<style scoped>
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

.caption {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: end;
}

.caption-span {
    white-space: nowrap;
    overflow: hidden;
    color: #fff;
    font-weight: bold;
    padding-top: 0;
    margin-top: 0;
}

.title {
    font-size: 1.0rem;
    /* color: #fff; */
    margin: 0;
}

.channel {
    font-size: 0.8rem;
    /* color: #666; */
    margin: 0;
}
</style>