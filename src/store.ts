import { ref, reactive } from "vue";
import SongBuffer from "./SongBuffer";
import type SongPlayer from "./SongPlayer";

export const songBuffer = reactive<SongBuffer>(new SongBuffer());
export const songPlayer = ref<SongPlayer | null>(null);
export const showSongPlayer = ref<boolean>(false);

// export const getSongBuffer = () => {
//   return songBuffer.value;
// }

// export const getSongPlayer = () => {
//   return songPlayer.value;
// }
// export const setSongPlayer = (newSongPlayer: SongPlayer) => { 
//   songPlayer.value = newSongPlayer;
// }

// export const isPlaying = ref<boolean>(false);
// export const audio = ref<HTMLAudioElement | null>(null);

// export const togglePlay = () => {
//     if (audio.value) {
//         isPlaying.value ? audio.value.pause() : audio.value.play();
//         isPlaying.value = !isPlaying.value;
//     }
// }
