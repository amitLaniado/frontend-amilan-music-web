export interface SongDetails {
    title: string;
    channel: string;
    url: string;
}

export interface Song {
    songDetails: SongDetails;
    mp3Url: string | null;
}

export interface PlaylistDetails {
    id: number;
    name: string;
    songs_amount: number;
}
