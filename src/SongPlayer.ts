import { ref } from 'vue';
import type { Ref } from 'vue';
import { fetchAddSongToPlaylist } from "./api";
import type { Song, SongDetails } from "./interfaces";
import { songBuffer } from "./store";

class SongPlayer {
    private audio: HTMLAudioElement;
    private songDetails: SongDetails;
    private isPlaying: boolean;
    private currentTime: Ref<number> = ref(0);
    private duration: Ref<number> = ref(0);

    private checkEndOfSong(): void {
        this.currentTime.value === this.duration.value &&
            songBuffer.skipSong(); 
    }

    constructor(song: Song) {
        this.audio = song.mp3Url ? new Audio(song.mp3Url) : new Audio();
        this.songDetails = song.songDetails;
        this.isPlaying = false;
        
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime.value = this.audio.currentTime;
            this.duration.value = this.audio.duration;
            this.checkEndOfSong();
        })
    }

    public togglePlay(): void {
        this.isPlaying ? this.pause() : this.play();
        // isPlaying = !isPlaying;
    }
    public play(): void { 
        this.audio.play();
        this.isPlaying = true;
    }
    public pause(): void {
        this.audio.pause();
        this.isPlaying = false;
    }

    public setSongDetails(songDetails: SongDetails): void {
        this.songDetails = songDetails;
    }
    public setMp3Url(mp3Url: string): void {
        // this.audio = new Audio(mp3Url);
        this.audio.src = mp3Url;
    }
    public seekToTime(time: number): void {
        // this.currentTime.value = time;
        // this.currentTime = time;
        this.audio.currentTime = time;
    }

    // seek(time: number) {
    //     this.audio.currentTime = time;
    //     this.currentTime = time;
    // }

    public getIsPlaying(): boolean {
        return this.isPlaying;
    }
    public getSongDetails(): SongDetails {
        return this.songDetails;
    }
    public getPicUrl(): string {
        return this.songDetails.base_pic_url;
    }
    public getTitle(): string {
        return this.songDetails.title;
    }
    public getChannel(): string {
        return this.songDetails.channel;
    }
    // public getCurrentTimeRef(): Ref<number> {
    //     return this.currentTime;
    // }
    public getCurrentTime(): number {
        return this.currentTime?.value ?? this.currentTime;
    }
    public getDuration(): number {
        return this.duration?.value ?? this.duration;
    }
    // public getCurrentTime(): number {
    //     return this.currentTime.value;
    // }
    // public getDuration(): number {
    //     return this.duration.value;
    // }
    // public getCurrentTime(): number {
    //     // return this.audio.currentTime;
    //     return this.currentTime;
    // }
    // public getDuration(): number {
    //     // const duration = this.audio.duration;
    //     // return Array.isArray(duration) ? duration[0] : duration;
    //     return this.duration
    // }

    public async addSongToPlaylist(playlistId: number): Promise<void> {
        await fetchAddSongToPlaylist(this.songDetails, playlistId);
    }
}

export default SongPlayer;