import axios, { AxiosRequestConfig } from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 15000,
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const apiClient = {
  get: async <T>(url: string, options: AxiosRequestConfig = {}): Promise<T> => {
    const res = await instance.get<T>(url, {
      ...options,
      withCredentials: true
    })
    return res.data
  },
  post: async <T>(
    url: string,
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const res = await instance.post<T>(url, data, {
      ...options,
      withCredentials: true
    })
    return res.data
  },
  put: async <T>(
    url: string,
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const res = await instance.put<T>(url, data, {
      ...options,
      withCredentials: true
    })
    return res.data
  },
  delete: async <T>(
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const res = await instance.delete<T>(url, {
      ...options,
      withCredentials: true
    })
    return res.data
  },
  patch: async <T>(
    url: string,
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const res = await instance.patch<T>(url, data, {
      ...options,
      withCredentials: true
    })
    return res.data
  }
}
