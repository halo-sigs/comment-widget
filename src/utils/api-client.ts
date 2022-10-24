import {
  ApiConsoleHaloRunV1alpha1UserApi,
  ApiHaloRunV1alpha1CommentApi,
} from "@halo-dev/api-client";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

const apiClient = {
  user: new ApiConsoleHaloRunV1alpha1UserApi(undefined, apiUrl, axiosInstance),
  comment: new ApiHaloRunV1alpha1CommentApi(undefined, apiUrl, axiosInstance),
};

export { apiClient };
