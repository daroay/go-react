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

  if(token === null){
    console.error("You cant send an empty token to authorizedAxios()")
    return null
  }

  let currentToken = token

  const axiosApiInstance = axios.create();

  // Request interceptor for API calls
  axiosApiInstance.interceptors.request.use(
    async config => {
      currentToken = currentToken || await getAccessToken()
      config.headers = { 
        'Authorization': `Bearer ${currentToken}`,
        'Accept': 'application/json',
        'Pepito': "O"
      }
      return config;
    },
    error => {
      Promise.reject(error)
  });
  
  // Response interceptor for API calls
  axiosApiInstance.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalConfig = error.config;
    const unauthorized = error.response.status >= 400 && error.response.status < 500
    if (unauthorized && !originalConfig._retry) {
      originalConfig._retry = true;
      currentToken = null     
      return axiosApiInstance(originalConfig);
    }
    return Promise.reject(error);
  });

  return axiosApiInstance

}

export { authorizedAxios, unAuthorizedAxios }