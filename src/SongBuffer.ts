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
        return this.songs.length - 1 <= this.currSongIndex;
    }
    private isFirstSong(): boolean {
        return this.currSongIndex === 0;
    }
    private nextSongIndex(): number {
        return this.isLastSong() ? 0 : this.currSongIndex + 1;  
    }
    private previosSongIndex(): number {
        return this.isFirstSong() ? 
            this.songs.length - 1 : this.currSongIndex - 1;
    }

    
    public isEmpty(): boolean {
        return !!this.songs.length;
    }

    public async setSongs(songsDetails: SongDetails[], index: number = 0) {
        this.songs = songsDetails.map(songDetails => ({ 
            songDetails, 
            mp3Url: null
        }));
        this.currSongIndex = index;
        await this.loadMp3Url();
        this.loadMp3Url(this.nextSongIndex());
    }

    public async loadMp3Url(index: number = this.currSongIndex) {
        if (!this.songs[index].mp3Url) {
            const song = this.songs[index];
            const songUrl = song.songDetails.url;
            song.mp3Url = await fetchMp3File(songUrl) ?? null;
        }
    }

    public skipSong() {
        this.currSongIndex = this.nextSongIndex();
        this.loadMp3Url(this.nextSongIndex());
    }

    public previousSong() {
        this.currSongIndex = this.previosSongIndex();
        this.loadMp3Url(this.previosSongIndex());
    }

    public revokeMp3Url(index: number) {
        const songMp3Url: string | null = this.songs[index].mp3Url;
        songMp3Url && URL.revokeObjectURL(songMp3Url);
    }
}

export default SongBuffer;