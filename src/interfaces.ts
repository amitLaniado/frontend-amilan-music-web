export interface Song {
    title: string;
    channel: string;
    url: string;
}

export interface PlaylistDetails {
    id: number;
    name: string;
    songs_amount: number;
}
