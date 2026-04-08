/**
 * API Client for SmartInboxENV
 * Handles all communication with the backend server
 */

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Request failed',
          code: errorData.code || 'UNKNOWN_ERROR',
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    login: (email: string, password: string) =>
      this.request<{ token: string; user: { id: string; email: string; name: string } }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      ),

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    profile: () =>
      this.request<{ id: string; email: string; name: string; stats: any }>(
        '/auth/profile',
        { method: 'GET' }
      ),
  };

  // Environment endpoints
  env = {
    reset: () =>
      this.request<any>('/env/reset', { method: 'POST' }),

    step: (action: any) =>
      this.request<any>('/env/step', {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),

    getState: () =>
      this.request<any>('/env/state', { method: 'GET' }),

    getObservation: () =>
      this.request<any>('/env/observation', { method: 'GET' }),
  };

  // Tasks and episodes
  tasks = {
    list: () =>
      this.request<any[]>('/tasks', { method: 'GET' }),

    getTask: (taskId: string) =>
      this.request<any>(`/tasks/${taskId}`, { method: 'GET' }),

    startEpisode: (taskId: string) =>
      this.request<any>('/episodes', {
        method: 'POST',
        body: JSON.stringify({ taskId }),
      }),

    getEpisode: (episodeId: string) =>
      this.request<any>(`/episodes/${episodeId}`, { method: 'GET' }),

    endEpisode: (episodeId: string, result: any) =>
      this.request<any>(`/episodes/${episodeId}`, {
        method: 'POST',
        body: JSON.stringify({ result }),
      }),
  };

  // Inference endpoints
  inference = {
    run: (numEpisodes: number = 1) =>
      this.request<any>('/inference/run', {
        method: 'POST',
        body: JSON.stringify({ numEpisodes }),
      }),

    getResults: (inferenceId: string) =>
      this.request<any>(`/inference/${inferenceId}`, { method: 'GET' }),
  };

  // Health check
  health = () =>
    this.request<{ status: string; version: string }>('/health', { method: 'GET' });
}

export const apiClient = new ApiClient();
