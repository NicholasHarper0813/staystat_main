import axios_, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "@/constants/constant";

interface CacheItem {
  data: any;
  expiry: number;
}

const cache: { [key: string]: CacheItem } = {};

let axios: any;

if (typeof window !== "undefined") {
  const authToken = localStorage.getItem("authToken");

  axios = axios_.create({
    baseURL: BASE_URL,
    headers: {
      authtoken: authToken ? authToken : "",
    },
  });
} else {
  axios = axios_.create({
    baseURL: BASE_URL,
  });
}

// Extend the axios object with the caching mechanism
axios.withCache = async (
  config: AxiosRequestConfig & { cacheTime?: number },
): Promise<AxiosResponse> => {
  const { cacheTime, ...axiosConfig } = config;
  const cacheKey = `${axiosConfig.method}-${axiosConfig.url}-${JSON.stringify(axiosConfig.params)}`;

  // Check if the request is cached and not expired
  if (cacheTime && cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
    return Promise.resolve({ data: cache[cacheKey].data } as AxiosResponse);
  }

  try {
    const response = await axios(axiosConfig);

    // Cache the response if cacheTime is provided
    if (cacheTime) {
      cache[cacheKey] = {
        data: response.data,
        expiry: Date.now() + cacheTime,
      };
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default axios;
