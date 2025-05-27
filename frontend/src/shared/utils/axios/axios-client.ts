import { AxiosRequestOptions } from "./axios-types"
import { AxiosCustomError } from "./axios-error"
import axios, { AxiosRequestConfig } from "axios"

const instance = axios.create({
  baseURL: process.env.SERVER_URL,
  timeout: 5000,
  withCredentials: true
})

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status || 500
    const message =
      error.response?.data?.message || error.message || "Unknown error"
    return Promise.reject(new AxiosCustomError(status, message))
  }
)

export const apiClient = {
  get: async <T>(url: string, options?: AxiosRequestOptions): Promise<T> => {
    const res = await instance.get<T>(url, options as AxiosRequestConfig)
    return res.data
  },
  post: async <T>(
    url: string,
    data?: any,
    options?: AxiosRequestOptions
  ): Promise<T> => {
    const res = await instance.post<T>(url, data, options as AxiosRequestConfig)
    return res.data
  },
  put: async <T>(
    url: string,
    data?: any,
    options?: AxiosRequestOptions
  ): Promise<T> => {
    const res = await instance.put<T>(url, data, options as AxiosRequestConfig)
    return res.data
  },
  delete: async <T>(url: string, options?: AxiosRequestOptions): Promise<T> => {
    const res = await instance.delete<T>(url, options as AxiosRequestConfig)
    return res.data
  },
  patch: async <T>(
    url: string,
    data?: any,
    options?: AxiosRequestOptions
  ): Promise<T> => {
    const res = await instance.patch<T>(
      url,
      data,
      options as AxiosRequestConfig
    )
    return res.data
  }
}
