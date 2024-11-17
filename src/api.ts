import axios from 'axios';
import type { PlaylistDetails, SongDetails } from './interfaces.ts';

const backendServiceUrl = import.meta.env.VITE_BACKEND_SERVICE_URL;

export const fetchSongOptions = async (songName: string): Promise<SongDetails[] | undefined> => {
    try {
        console.log("search song options for: ", songName);

        const response = await axios.get(`${backendServiceUrl}/song/songOptions/${songName}`);
        return response.data.songs_details;
    } catch (error) {
        console.error("error: ", error);
    }
}

export const fetchMp3File = async (songUrl: string): Promise<string | undefined> => {
    try {
        const requestData = {
            song_url: songUrl,
        };
      
        const response = await axios.post(`${backendServiceUrl}/song/download`, requestData, {
            responseType: 'blob',  // Expect a binary response (file)
        });
        const blob = new Blob([response.data], { type: 'audio/mp3' });
        const mp3Url = URL.createObjectURL(blob); // Generate a temporary URL
        console.log("mp3Url = ", mp3Url);
        return mp3Url;
    } catch (error) {
        console.error('Error fetching MP3 file:', error);
    }
};

export const fetcPlaylistsDetails = async (userId: number): Promise<PlaylistDetails[] | undefined> => {
    try {
        const userId = 0;
        const response = await axios.get(`${backendServiceUrl}/playlists/user/${userId}`);
        return response.data.playlists_details;
    } catch (error) {
        console.error("error: ", error);
    }
};

export const fetcPlaylistSongsDetails = async (playlistId: number): Promise<SongDetails[] | undefined> => {
    try {
        const response = await axios.get(`${backendServiceUrl}/playlists/${playlistId}`);
        return response.data.songs_details;
    } catch (error) {
        console.error("error: ", error);
    }
};

export const addSongToPlaylist = async (songDetails: SongDetails, playlistId: number): Promise<number | undefined> => {
    try {
        const body: { song_details: SongDetails, playlist_id: number} = { song_details: songDetails, playlist_id: playlistId };
        const response = await axios.post(`${backendServiceUrl}/playlists/add_song`, body);
        return response.data.playlist_song_id;
    } catch (error) {
        console.error("error: ", error);
    }
}