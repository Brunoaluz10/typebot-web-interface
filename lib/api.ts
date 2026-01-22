/**
 * Cliente API para comunicação com backend FastAPI
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BotCreateRequest {
  description: string;
  use_ai?: boolean;
  skip_web?: boolean;
}

export interface BotCreateResponse {
  success: boolean;
  bot_id?: string;
  name?: string;
  url?: string;
  strategy_used?: string;
  error?: string;
  validation?: any;
}

export interface BotHistoryItem {
  id: number;
  bot_id: string;
  name: string;
  description?: string;
  strategy_used?: string;
  status: string;
  created_at: string;
  url?: string;
  error_message?: string;
}

export interface TemplateItem {
  id: number;
  name: string;
  pattern?: string;
  success_count: number;
  created_at: string;
  last_used?: string;
  template_data?: any;
}

export interface ConfigResponse {
  typebot_url: string;
  workspace_id: string;
  ai_enabled: boolean;
  ai_model?: string;
  headless: boolean;
}

export interface StatsResponse {
  total_bots: number;
  by_status: Record<string, number>;
  by_strategy: Record<string, number>;
}

// API Methods
export const botAPI = {
  create: async (request: BotCreateRequest): Promise<BotCreateResponse> => {
    const response = await api.post('/bots/create', request);
    return response.data;
  },

  getHistory: async (limit = 50, offset = 0): Promise<BotHistoryItem[]> => {
    const response = await api.get('/bots/history', { params: { limit, offset } });
    return response.data;
  },

  getBot: async (botId: string): Promise<any> => {
    const response = await api.get(`/bots/${botId}`);
    return response.data;
  },

  getTemplates: async (): Promise<TemplateItem[]> => {
    const response = await api.get('/templates');
    return response.data;
  },

  useTemplate: async (templateName: string, adaptations?: any): Promise<BotCreateResponse> => {
    const response = await api.post('/templates/use', { template_name: templateName, adaptations });
    return response.data;
  },

  getConfig: async (): Promise<ConfigResponse> => {
    const response = await api.get('/config');
    return response.data;
  },

  updateConfig: async (config: Partial<ConfigResponse>): Promise<any> => {
    const response = await api.put('/config', config);
    return response.data;
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get('/stats');
    return response.data;
  },

  getLogs: async (botId?: string, limit = 100): Promise<any[]> => {
    const response = await api.get('/logs', { params: { bot_id: botId, limit } });
    return response.data;
  },
};

// WebSocket para logs em tempo real
export class LogsWebSocket {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(private onMessage: (log: any) => void) {}

  connect() {
    try {
      this.ws = new WebSocket(`${WS_URL}/logs`);

      this.ws.onopen = () => {
        console.log('WebSocket conectado');
      };

      this.ws.onmessage = (event) => {
        try {
          const log = JSON.parse(event.data);
          this.onMessage(log);
        } catch (e) {
          console.error('Erro ao parsear log:', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket desconectado. Tentando reconectar...');
        this.reconnect();
      };
    } catch (e) {
      console.error('Erro ao conectar WebSocket:', e);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }
}
