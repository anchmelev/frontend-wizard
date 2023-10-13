import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from './types';
import { notification } from 'antd';

export const httpApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface ApiErrorData {
  detail: string;
}

httpApi.interceptors.response.use(undefined, (error: AxiosError<ApiErrorData>) => {
  if (!navigator.onLine) {
    notification.error({
      key: 'noInternetConnection',
      message: 'Ошибка сети',
      description: 'Отсутствует интернет-соединение!',
    });
  } else if (!error.response) {
    notification.error({
      key: 'serverUnavailable',
      message: 'Ошибка сервера',
      description: 'Сервер временно недоступен. Пожалуйста, попробуйте позже.',
    });
  }

  throw new ApiError<ApiErrorData>(error.response?.data?.detail || error.message, error.response?.data);
});
