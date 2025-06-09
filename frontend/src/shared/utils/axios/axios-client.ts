import axios, { AxiosRequestConfig } from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 15000,
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    console.log("[AXIOS REQUEST]", config.method?.toUpperCase(), config.url)
    console.log("[AXIOS REQUEST] Headers:", config.headers)
    console.log("[AXIOS REQUEST] Data:", config.data)
    return config
  },
  (error) => {
    console.error("[AXIOS REQUEST ERROR]", error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    console.log(
      "[AXIOS RESPONSE]",
      res.config.method?.toUpperCase(),
      res.config.url,
      "Status:",
      res.status
    )
    console.log("[AXIOS RESPONSE] Data:", res.data)
    return res
  },
  (error) => {
    console.error(
      "[AXIOS RESPONSE ERROR]",
      error.response?.status,
      error.response?.data,
      error.message
    )
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
