import http from '@/utils/http';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';

// 定义用户类型
interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
}

// 定义 Telegram 验证响应类型
interface TelegramVerifyResponse {
  success: boolean;
  message?: string;
}

// 定义 TON 账户类型
interface TonAccount {
  address: string;
  balance: string;
  status: 'active' | 'uninitialized' | 'frozen';
  lastActivity: number;
}

// 定义 TON 交易类型
interface TonTransaction {
  hash: string;
  lt: string;
  account: string;
  success: boolean;
  value: string;
  fee: string;
  timestamp: number;
  comment?: string;
}

// 用户相关 API
export const userService = {
  // 获取用户信息
  async getUserInfo(userId: string): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<User> = await http.get<User>(`/users/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取用户信息失败'
      };
    }
  },

  // 更新用户信息
  async updateUserInfo(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<User> = await http.put<User>(`/users/${userId}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '更新用户信息失败'
      };
    }
  }
};

// Telegram 相关 API
export const telegramService = {
  // 验证 Telegram 初始化数据
  async verifyTelegramData(initData: string): Promise<ApiResponse<TelegramVerifyResponse>> {
    try {
      const response: AxiosResponse<TelegramVerifyResponse> = await http.post<TelegramVerifyResponse>('/telegram/verify', { initData });
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '验证 Telegram 数据失败'
      };
    }
  }
};

// TON 相关 API
export const tonService = {
  // 获取账户信息
  async getAccount(address: string): Promise<ApiResponse<TonAccount>> {
    try {
      const response: AxiosResponse<TonAccount> = await http.get<TonAccount>(`/ton/accounts/${address}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取账户信息失败'
      };
    }
  },

  // 获取交易历史
  async getTransactions(address: string, limit: number = 20): Promise<ApiResponse<TonTransaction[]>> {
    try {
      const response: AxiosResponse<TonTransaction[]> = await http.get<TonTransaction[]>(`/ton/accounts/${address}/transactions`, {
        params: { limit }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取交易历史失败'
      };
    }
  }
};

// 默认导出所有服务
export default {
  user: userService,
  telegram: telegramService,
  ton: tonService
};