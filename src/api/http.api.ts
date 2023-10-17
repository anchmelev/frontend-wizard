import axios, { AxiosRequestHeaders } from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from './types';
import { notification } from 'antd';
import { readAccessToken } from '@app/services/localStorage.service';

export const httpApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface ApiErrorData {
  detail: string;
}

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${readAccessToken()}` } as AxiosRequestHeaders;

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError<ApiErrorData>) => {
  if (!navigator.onLine) {
    notification.error({
      key: 'noInternetConnection',
      message: 'Network error',
      description: 'No internet connection!',
    });
  } else if (!error.response) {
    notification.error({
      key: 'serverUnavailable',
      message: 'Server error',
      description: 'The server is temporarily unavailable. Please try again later.',
    });
    // TODO: базовая обработка 401
  } else if (error.response.status === 401) {
    notification.error({
      key: 'unauthorized',
      message: 'Authentication error',
      description: 'Your session has expired. Please refresh the page to continue.',
    });
  }

  throw new ApiError<ApiErrorData>(error.response?.data?.detail || error.message, error.response?.data);
});
