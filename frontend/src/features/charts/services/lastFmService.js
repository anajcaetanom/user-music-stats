import axios from 'axios';
import { handleApiError } from '../../../shared/utils/handleApiError';

const baseURL = import.meta.env.VITE_PROXY_LASTFM_URL;

export const fetchProfilePic = async (username) => {
    try {
        const url = `${baseURL}/profile-pic/${encodeURIComponent(username)}`;
        const res = await axios.get(url);

        return res.data;
    } catch (err) {
        handleApiError(err);
    }
};

export const fetchCategory = async (username, category, timespan) => {
    try {
        const user = encodeURIComponent(username)
        let url = '';

        switch (category) {
            case 'artists':
                url = `${baseURL}/top-artists/${user}`;
                break;
            case 'albums':
                url = `${baseURL}/top-albums/${user}`;
                break;
            case 'tracks':
                url = `${baseURL}/top-tracks/${user}`;
                break;
            default:
                throw new Error('Invalid category.');
        }

        const res = await axios.get(url, {
            params: {
                period: timespan,
                limit: 10,
            },
        });

        return res.data;
    } catch (err) {
        handleApiError(err);
    }
};
