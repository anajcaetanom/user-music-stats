import axios from "axios";
import {handleApiError} from "../../../shared/utils/handleApiError";

const baseURL = import.meta.env.VITE_PROXY_SPOTIFY_URL;

export const cleanRedis = async () => {
  try {
    const res = await axios.get(`${baseURL}/cleanRedis`);
    return res.data;

  } catch (err) {
    handleApiError(err);
  }
}

export const fetchUserName = async (requestId) => {
  try {
    const res = await axios.get(`${baseURL}/userName`, {
      params: {
        id: requestId
      }
    });

    return res.data;

  } catch (err) {
    handleApiError(err);
  }
};

export const fetchCategory = async (requestId, category, timespan) => {
  try {
    let url = `${baseURL}/top/${category}`;

    const res = await axios.get(url, {
      params: {
        time_range: timespan,
        limit: 10,
        id: requestId
      }
    });

    return res.data;

  } catch (err) {
    handleApiError(err);
  }
}

