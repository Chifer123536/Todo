import axios, { AxiosRequestConfig } from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 15000,
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    )
    return config
  },
  (error) => {
    console.error("[API Request Error]", error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    console.log(
      `[API Response] ${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url} - ${res.status}`
    )
    return res
  },
  (error) => {
    if (error.response) {
      console.error(
        `[API Response Error] ${error.config.method?.toUpperCase()} ${error.config.baseURL}${error.config.url} - ${error.response.status}`,
        error.response.data
      )
    } else {
      console.error("[API Response Error] No response received", error.message)
    }
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
