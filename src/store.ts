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
    console.log("updateAudioSrcNode");
    if (!audioContext) {
        console.log("audioContext is null");
        // audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (window.AudioContext || window.webkitAudioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } else {
            throw new Error("Web Audio API is not supported in this browser.");
        }          
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 1.0;
    }

    if (audio.value) {
        const source: MediaElementAudioSourceNode = audioContext.createMediaElementSource(audio.value);
        gainNode && source.connect(gainNode);

        audio.value.addEventListener("play", () => {
            audioContext?.resume().catch((err: Error) =>
                console.error("Error resuming AudioContext:", err)
            );
        });
    }
}

export const updateVolume = (): void => {
    if (gainNode) gainNode.gain.value = volume.value;
};

export const togglePlay = () => {
    if (audio.value) {
        isPlaying.value ? audio.value.pause() : audio.value.play();
        isPlaying.value = !isPlaying.value;
    }
}
