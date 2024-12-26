import { ref, watch } from "vue";
import SongBuffer from "./SongBuffer";

export const songBuffer = ref<SongBuffer>(new SongBuffer());
export const showSongPlayer = ref<boolean>(false);
export const isPlaying = ref<boolean>(false);
export const audio = ref<HTMLAudioElement | null>(null);
export const volume = ref<number>(1.0); 
export let audioContext: AudioContext | null = null;
let gainNode: GainNode | null;

export const updateAudioSrcNode = () => {
    if (!audioContext) {
        audioContext = new AudioContext();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 1.0;
    }
    
    if (audio.value) {
        const source: MediaElementAudioSourceNode = audioContext.createMediaElementSource(audio.value);
        source.connect(gainNode);

        audio.value.addEventListener("play", () => {
            audioContext.resume().catch((err: Error) =>
                console.error("Error resuming AudioContext:", err)
            );
        });
    }
}

export const updateVolume = (): void => {
    gainNode.gain.value = volume.value;
};

export const togglePlay = () => {
    if (audio.value) {
        isPlaying.value ? audio.value.pause() : audio.value.play();
        isPlaying.value = !isPlaying.value;
    }
}
