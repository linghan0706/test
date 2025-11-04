'use client';

import type { TelegramUser, TelegramInitData, TelegramChat } from '../types';
import { retrieveRawInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * 初始化 Telegram WebApp（保留原接口，确保兼容）
 */
export function initializeTelegramApp() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    console.warn('当前不在 Telegram WebApp 环境中');
    return null;
  }
  try {
    const tg = window.Telegram.WebApp;
    tg.ready();
    return tg;
  } catch (e) {
    console.warn('初始化 Telegram WebApp 失败：', e);
    return null;
  }
}

/**
 * 使用 telegram-apps/sdk-react 获取并解析 initData
 */
export function getInitData(): TelegramInitData | null {
  if (typeof window === 'undefined') return null;

  try {
    // 非 Telegram 环境直接返回 null，避免 SDK 报错日志
    if (!isTelegramEnvironment()) {
      return null;
    }
    // 使用 SDK 的原生方法获取原始 initData 字符串
    const raw = retrieveRawInitData();
    if (!raw) return null;

    const data = JSON.parse(raw) as {
      user?: { id: number; first_name: string; username?: string };
      auth_date: number;
      hash: string;
      start_param?: string;
      chat?: unknown;
    };

    const formatted: TelegramInitData = {
      user: data.user
        ? ({
            id: data.user.id,
            first_name: data.user.first_name,
            username: data.user.username,
          } as TelegramUser)
        : undefined,
      auth_date: data.auth_date,
      hash: data.hash,
    };

    if (data.start_param) {
      formatted.start_param = data.start_param;
    }
    if (data.chat) {
      formatted.chat = data.chat as TelegramChat;
    }

    return formatted;
  } catch (e) {
    console.warn('通过 SDK 获取 initData 失败：', e);
    return null;
  }
}

/**
 * 获取当前用户信息
 */
export function getTelegramUser(): TelegramUser | null {
  const initData = getInitData();
  return initData?.user || null;
}

/**
 * 检查是否在 Telegram 环境中运行
 */
export function isTelegramEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // 若能正常检索到 Launch Params，则视为在 Telegram 环境
    retrieveLaunchParams();
    return true;
  } catch {
    return !!window.Telegram?.WebApp;
  }
}

/**
 * 返回以查询字符串形式表示的 initData（仅包含 user、auth_date、hash）
 * @returns {string} 例如: "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123"
 */
export function getFormattedInitData(): { initData: string } | null {
  const formattedData = formatInitDataToQueryString();
  if (!formattedData) return null;
  return { initData: formattedData };
}

/**
 * 将 SDK 获取的 initData 转为查询字符串（内部使用）
 */
export function formatInitDataToQueryString(): string | null {
  const initData = getInitData();
  if (!initData) return null;

  const params = new URLSearchParams();

  // user：使用 JSON 字符串表示
  if (initData.user) {
    const userStr = JSON.stringify({
      id: initData.user.id,
      first_name: initData.user.first_name,
      ...(initData.user.username ? { username: initData.user.username } : {}),
    });
    params.append('user', userStr);
  }

  params.append('auth_date', initData.auth_date.toString());
  params.append('hash', initData.hash);

  return params.toString();
}

