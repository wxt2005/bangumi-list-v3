import axios, { AxiosInstance, Method } from 'axios';
import { STORAGE_CREDENTIAL_NAME } from '../constants/storage';
class API {
  private instance: AxiosInstance;
  private credentialToken?: string;

  constructor() {
    this.instance = axios.create({
      baseURL: '/api/v1/',
      timeout: 5000,
    });
    this.loadCredential();
  }

  private loadCredential() {
    let token = '';
    try {
      token =
        localStorage.getItem(STORAGE_CREDENTIAL_NAME) ||
        sessionStorage.getItem(STORAGE_CREDENTIAL_NAME) ||
        '';
    } catch (e) {
      // ignore
    }
    if (token) {
      this.credentialToken = token;
    }
  }

  public setCredential(token: string) {
    this.credentialToken = token;
  }

  public saveCredential(sessionOnly = false) {
    if (!this.credentialToken) return;
    if (sessionOnly) {
      sessionStorage.setItem(STORAGE_CREDENTIAL_NAME, this.credentialToken);
    } else {
      localStorage.setItem(STORAGE_CREDENTIAL_NAME, this.credentialToken);
    }
  }

  public removeCredential() {
    this.credentialToken = undefined;
    try {
      localStorage.removeItem(STORAGE_CREDENTIAL_NAME);
      sessionStorage.removeItem(STORAGE_CREDENTIAL_NAME);
    } catch (e) {
      // ignore
    }
  }

  public hasCredential(): boolean {
    return !!this.credentialToken;
  }

  private getRequestHeaders(needCredential = false): Record<string, string> {
    const headers: Record<string, string> = {};
    if (needCredential) {
      headers['Authorization'] = `Bearer ${this.credentialToken || ''}`;
    }
    return headers;
  }

  public async request<Type>(
    method: Method,
    endpoint: string,
    params?: Record<string, unknown>,
    data?: Record<string, unknown>,
    needCredential = false
  ): Promise<Type> {
    const response = await this.instance.request({
      url: endpoint,
      method,
      params,
      data,
      headers: this.getRequestHeaders(needCredential),
    });
    return response.data as Type;
  }
}

export default new API();
