import axios from "axios";

const baseURL = import.meta.env.VITE_PROXY_SPOTIFY_URL;

export const cleanRedis = async () => {
  try {
    const res = await axios.get(`${baseURL}/cleanRedis`);
    return res.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erro ao pegar charts spotify."
      );
    }
    throw new Error("Erro inesperado");
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

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erro ao pegar username spotify."
      );
    }
    throw new Error("Erro inesperado");
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

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erro ao pegar spotify charts."
      );
    }
    throw new Error("Erro inesperado");
  }
}

