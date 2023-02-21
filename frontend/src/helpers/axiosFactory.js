import axios from "axios";
import { getAccessToken } from "./access";

// This library should only be imported to App.js and exported from there to the rest of the components as outletContext

const unAuthorizedAxios = () => {

  const axiosApiInstance = axios.create();

  // Request interceptor for API calls
  axiosApiInstance.interceptors.request.use(
    async config => {
      config.headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      return config;
    },
    error => {
      Promise.reject(error)
  });

  return axiosApiInstance;

}

const authorizedAxios = (token) => {

  const axiosApiInstance = axios.create();

  // Request interceptor for API calls
  axiosApiInstance.interceptors.request.use(
    async config => {
      const value = token || await getAccessToken()
      console.log("new bearer" , value)
      config.headers = { 
        'Authorization': `Bearer ${value}`,
        'Accept': 'application/json',
      }
      return config;
    },
    error => {
      console.log("xx", error)
      Promise.reject(error)
  });
  
  // Response interceptor for API calls
  axiosApiInstance.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    console.log("res", error)
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await getAccessToken()          
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
  });

  return axiosApiInstance

}

export { authorizedAxios, unAuthorizedAxios }