import { ref } from "vue";
import SongBuffer from "./SongBuffer";

export const songBuffer = ref<SongBuffer>(new SongBuffer());
export const showSongPlayer = ref<boolean>(false);
export const isPlaying = ref<boolean>(false);
export const audio = ref<HTMLAudioElement | null>(null);

export const togglePlay = () => {
    if (audio.value) {
        isPlaying.value ? audio.value.pause() : audio.value.play();
        isPlaying.value = !isPlaying.value;
    }
}
