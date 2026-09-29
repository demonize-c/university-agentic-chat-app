import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from "axios"

// Base URL can be overridden via environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

/**
 * Main Axios Instance for the Application
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
})

/**
 * Default Request Interceptor
 * Adds authentication tokens or default headers if needed
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can attach auth tokens here if required:
    // const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Default Response Interceptor
 * Standardizes API responses and handles global errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error(`[API Error ${error.response.status}]:`, error.response.data)
    } else if (error.request) {
      console.error("[API Network Error]: No response received from server")
    } else {
      console.error("[API Error]:", error.message)
    }
    return Promise.reject(error)
  }
)

/**
 * Helper to dynamically register a custom request interceptor
 */
export const addRequestInterceptor = (
  onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  onRejected?: (error: any) => any
): number => {
  return apiClient.interceptors.request.use(onFulfilled, onRejected)
}

/**
 * Helper to dynamically register a custom response interceptor
 */
export const addResponseInterceptor = (
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
  onRejected?: (error: any) => any
): number => {
  return apiClient.interceptors.response.use(onFulfilled, onRejected)
}

/**
 * Helper to eject a request interceptor by ID
 */
export const removeRequestInterceptor = (id: number): void => {
  apiClient.interceptors.request.eject(id)
}

/**
 * Helper to eject a response interceptor by ID
 */
export const removeResponseInterceptor = (id: number): void => {
  apiClient.interceptors.response.eject(id)
}
