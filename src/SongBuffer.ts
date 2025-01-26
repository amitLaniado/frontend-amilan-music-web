import type { Song, SongDetails } from "./interfaces";
import { fetchMp3File } from '@/api';
import { songPlayer } from "./store";
import SongPlayer from "./SongPlayer";

class SongBuffer {
    private songs: Song[];
    private currSongIndex: number;

    constructor() {
        this.songs = [];
        this.currSongIndex = 0;
    }

    public getCurrSong(): Song | null {
        return this.songs[this.currSongIndex] || null;
    }
    // public getCurrSongDetails(): SongDetails | null {
    //     return this.songPlayer?.getSongDetails() || null;
    // }
    // public getCurrSongMp3Url(): string | null {
    //     return this.songs.length ? this.songs[this.currSongIndex].mp3Url : null;
    // }

    public getNextSongsDetails(): SongDetails[] {
        const nextSongs = this.songs.slice(this.nextSongIndex());
        return nextSongs.map(song => song.songDetails);
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

    private async initializeSongPlayer() {
        songPlayer.value?.pause();
        const currSong = this.songs[this.currSongIndex];
        if (songPlayer.value) {
            Object.assign(songPlayer.value, new SongPlayer(currSong));
        } else {
            songPlayer.value = new SongPlayer(currSong);
        }
        if (!currSong.mp3Url) {
            await this.loadMp3Url();
            currSong.mp3Url && songPlayer.value.setMp3Url(currSong.mp3Url);
        }
        songPlayer.value.play();
    }

    public async setSongs(songsDetails: SongDetails[], index: number = 0) {
        this.songs = songsDetails.map(songDetails => ({ 
            songDetails, 
            mp3Url: null
        }));
        this.currSongIndex = index;
        // songPlayer.value = new SongPlayer(this.songs[this.currSongIndex]);
        await this.initializeSongPlayer();
        this.loadMp3Url(this.nextSongIndex());
    }

    public async loadMp3Url(index: number = this.currSongIndex) {
        if (!this.songs[index].mp3Url) { // TODO: do I need this condition?
            const song = this.songs[index];
            const songUrl = song.songDetails.song_url;
            song.mp3Url = await fetchMp3File(songUrl) ?? null;
        }
    }
    
    public async previousSong() {
        this.currSongIndex = this.previosSongIndex();
        await this.initializeSongPlayer();
    }
    public async skipSong() {
        this.currSongIndex = this.nextSongIndex();
        await this.initializeSongPlayer();
        this.loadMp3Url(this.nextSongIndex());
    }
    public async skipToSong(index: number) {
        this.currSongIndex += index;
        await this.initializeSongPlayer();
        this.loadMp3Url(this.nextSongIndex());
    }

    // public revokeMp3Url(index: number) {
    //     const songMp3Url: string | null = this.songs[index].mp3Url;
    //     songMp3Url && URL.revokeObjectURL(songMp3Url);
    // }
}

export default SongBuffer;