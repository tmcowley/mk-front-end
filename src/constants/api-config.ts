import { AxiosRequestConfig } from 'axios'

export type apiConfigType = {
  apiVersion: string,
  host: string,
  axiosGetConfigGenerator: (params?: {}) => AxiosRequestConfig<string>,
  axiosPostConfig: AxiosRequestConfig<string>, 
  axiosGetConfig: AxiosRequestConfig<string>
}

// API & Axios config
const axiosPostConfig: AxiosRequestConfig<string> = {
  withCredentials: true, 
  headers: {
    // 'Content-Length': 0,
    "Content-Type": "application/json",
  },
  responseType: "json",
}
const axiosGetConfigGenerator = (params?: {}): AxiosRequestConfig<string> => {
  return {
    headers: {
      // 'Content-Length': 0,
      "Content-Type": "text/plain",
    },
    responseType: "json",
    params: params,
  }
}

export const apiConfig: apiConfigType = {
  apiVersion: "/api/v0/",
  // host: "error",
  // host: "http://localhost:8080",
  host: "https://mirrored-keyboard.herokuapp.com",
  axiosGetConfigGenerator: axiosGetConfigGenerator,
  axiosPostConfig: axiosPostConfig,
  axiosGetConfig: axiosGetConfigGenerator(),
}
