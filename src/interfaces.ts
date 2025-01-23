export interface SongDetails {
    title: string;
    channel: string;
    song_url: string;
    base_pic_url: string;
}

export interface Song {
    songDetails: SongDetails;
    mp3Url: string | null;
}

export interface PlaylistDetails {
    id: number;
    name: string;
    pic_url: number;
    songs_amount: number;
}
