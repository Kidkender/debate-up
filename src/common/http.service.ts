import { Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpService {
  private readonly logger = new Logger(HttpService.name);

  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.log(
          `[Request] ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => {
        this.logger.error('[Request Error]', error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.request.use(
      (response) => response,
      (error) => {
        this.logger.error('[Request Error]', error);
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      url,
      config,
    );
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config,
    );
    return response.data;
  }
}
