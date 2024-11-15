import type { Song, SongDetails } from "./interfaces";
import { fetchMp3File } from '@/api';

class SongBuffer {
    private songs: Song[];
    private currSongIndex: number;

    constructor() {
        this.songs = [];
        this.currSongIndex = 0;
    }

    public getCurrentSong(): Song {
        return this.songs[this.currSongIndex];
    }
    public getCurrSongDetails(): SongDetails {
        return this.songs[this.currSongIndex].songDetails;
    }
    public getCurrSongMp3Url(): string | null {
        return this.songs[this.currSongIndex].mp3Url;
    }

    private isLastSong(): boolean {
        return this.songs.length - 1 > this.currSongIndex;
    }

    public async setSongs(songsDetails: SongDetails[], index: number = 0) {
        this.songs = songsDetails.map(songDetails => ({ 
            songDetails, 
            mp3Url: null
        }));
        this.currSongIndex = index;

        await this.loadMp3Url(this.currSongIndex); // maybe it better dont put this with await and then this and the next loadMp3Url would be simoutensly
        this.isLastSong() && await this.loadMp3Url(this.currSongIndex + 1);
    }

    public async loadMp3Url(index: number) {
        const song = this.songs[index];
        const songUrl = song.songDetails.url;
        song.mp3Url = await fetchMp3File(songUrl) ?? null;
    }

    public skipSong() {
        this.currSongIndex = this.isLastSong() ? 
            0 : this.currSongIndex + 1;
        !this.isLastSong() && this.loadMp3Url(this.currSongIndex + 1);
    }

    public revokeMp3Url(index: number) {
        const songMp3Url: string | null = this.songs[index].mp3Url;
        songMp3Url && URL.revokeObjectURL(songMp3Url);
    }
}

export default SongBuffer;