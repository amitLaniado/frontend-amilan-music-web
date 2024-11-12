import axios from 'axios';
import type { Song } from './interfaces.ts';

const baseUrl = "http://127.0.0.1:8000";

export const fetchSongOptions = async (songName: string): Promise<Song[] | undefined> => {
    try {
        console.log("search song options for: ", songName);

        const response = await axios.get(`${baseUrl}/song/songOptions/${songName}`);
        return response.data;
    } catch (error) {
        console.error("error: ", error);
    }
}

export const fetchMp3File = async (songUrl: string): Promise<string | undefined> => {
    try {
        const requestData = {
            song_url: songUrl,
        };
      
        const response = await axios.post('/song/download', requestData, {
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
