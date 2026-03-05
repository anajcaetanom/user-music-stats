import axios from "axios";
import {handleApiError} from "../../../shared/utils/handleApiError";

const baseURL = import.meta.env.VITE_PROXY_LASTFM_URL;

export const fetchProfilePic = async (username) => {
  try {
    const url = `${baseURL}/profile-pic/${username}`;
    const res = await axios.get(url);

    return res.data;

  } catch (err) {
    handleApiError(err);
  }
  // erro inesperado
  throw new Error("Erro inesperado ao buscar foto de perfil");
}

export const fetchCategory = async (username, category, timespan) => {

  try {
    let url = '';

    switch (category) {
      case 'artists':
        url = `${baseURL}/top-artists/${username}`;
        break;
      case 'albums':
        url = `${baseURL}/top-albums/${username}`;
        break;
      case 'tracks':
        url = `${baseURL}/top-tracks/${username}`;
        break;
      default:
        throw new Error('Invalid category.');
    }

    const res = await axios.get(url, {
      params: {
        period: timespan,
        limit: 10
      }
    });

    return res.data

  } catch (err) {
    handleApiError(err);
  }

}

