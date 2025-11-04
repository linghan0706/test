'use client';

import type { TelegramUser, TelegramInitData, TelegramChat } from '../types';

// 内部工具：加载 Telegram 脚本（若未存在）
async function loadTelegramScript(): Promise<void> {
  if (typeof window === 'undefined') return;
  if ((window as any).Telegram?.WebApp) return;

  const existing = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
  if (existing) return;

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://telegram.org/js/telegram-web-app.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load telegram-web-app.js'));
    document.head.appendChild(s);
  });
}

// 等待 Telegram WebApp 就绪（带超时）
export async function waitForTelegramWebApp(maxWaitMs = 5000): Promise<NonNullable<Window['Telegram']>['WebApp'] | null> {
  if (typeof window === 'undefined') return null;

  // 若脚本已加载且对象可用，直接返回
  if (window.Telegram?.WebApp) {
    try { window.Telegram.WebApp.ready(); } catch { /* noop */ }
    return window.Telegram.WebApp;
  }

  // 确保脚本已加载
  try {
    await loadTelegramScript();
  } catch {
    // 脚本加载失败时继续等待对象（在 Telegram 客户端内对象由宿主注入）
  }

  const start = Date.now();
  return await new Promise((resolve) => {
    const tick = () => {
      if (window.Telegram?.WebApp) {
        try { window.Telegram.WebApp.ready(); } catch { /* noop */ }
        resolve(window.Telegram.WebApp);
        return;
      }
      if (Date.now() - start >= maxWaitMs) {
        resolve(null);
        return;
      }
      setTimeout(tick, 50);
    };
    // 若文档尚未就绪，延迟到 DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tick, { once: true });
    } else {
      tick();
    }
  });
}

/**
 * 获取并初始化 Telegram WebApp
 */
export function initializeTelegramApp() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    console.warn('当前不在 Telegram WebApp 环境中');
    return null;
  }

  const tg = window.Telegram.WebApp;
  tg.ready();
  return tg;
}

/** 异步版本：等待环境就绪后返回 WebApp */
export async function initializeTelegramAppAsync(): Promise<NonNullable<Window['Telegram']>['WebApp'] | null> {
  const tg = await waitForTelegramWebApp();
  if (!tg) {
    console.warn('Telegram WebApp 未就绪或不可用');
    return null;
  }
  return tg;
}

/**
 * 获取解析后的 initData
 */
export function getInitData(): TelegramInitData | null {
  const tg = initializeTelegramApp();
  if (!tg) return null;

  const data = tg.initDataUnsafe as {
    user?: {
      id: number;
      first_name: string;
      username?: string;
    };
    auth_date: number;
    hash: string;
    start_param?: string;
    chat?: unknown;
  };

  if (!data) {
    console.warn('未检测到 initDataUnsafe');
    return null;
  }

  const formatted: TelegramInitData = {
    user: data.user ? {
      id: data.user.id,
      first_name: data.user.first_name,
      username: data.user.username,
    } as TelegramUser : undefined,
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
}

/** 异步获取解析后的 initData */
export async function getInitDataAsync(): Promise<TelegramInitData | null> {
  const tg = await initializeTelegramAppAsync();
  if (!tg) return null;

  const data = tg.initDataUnsafe as TelegramInitData | undefined;
  if (!data) {
    console.warn('未检测到 initDataUnsafe');
    return null;
  }
  return {
    user: data.user,
    auth_date: data.auth_date,
    hash: data.hash,
    start_param: data.start_param,
    chat: data.chat,
    query_id: (data as any).query_id,
    receiver: (data as any).receiver,
    chat_type: (data as any).chat_type,
    chat_instance: (data as any).chat_instance,
    can_send_after: (data as any).can_send_after,
  };
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
  return !!window.Telegram?.WebApp;
}

/**
 * 格式化 initData 数据为查询字符串格式
 * @returns {string} 格式如: "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123"
 * @example
 * const formattedData = formatInitDataToQueryString();
 */
export function getFormattedInitData(): { initData: string } | null {
  const formattedData = formatInitDataToQueryString();
  if (!formattedData) return null;
  
  return {
    initData: formattedData
  };
}

/** 异步版本：格式化 initData 为查询字符串 */
export async function getFormattedInitDataAsync(): Promise<{ initData: string } | null> {
  const formatted = await formatInitDataToQueryStringAsync();
  if (!formatted) return null;
  return { initData: formatted };
}

/**
 * 格式化 initData 数据为查询字符串格式（内部使用）
 * @returns {string} 格式如: "user=%7B%22id%22%3A123456%7D&auth_date=1234567890&hash=abc123"
 */
export function formatInitDataToQueryString(): string | null {
  const initData = getInitData();
  if (!initData) return null;

  const params = new URLSearchParams();

  // 处理 user 数据
  if (initData.user) {
    const userStr = JSON.stringify({
      id: initData.user.id,
      first_name: initData.user.first_name,
      ...(initData.user.username ? { username: initData.user.username } : {})
    });
    params.append('user', userStr);
  }

  // 添加 auth_date
  params.append('auth_date', initData.auth_date.toString());

  // 添加 hash
  params.append('hash', initData.hash);

  return params.toString();
}

/** 异步版本：格式化 initData 为查询字符串 */
export async function formatInitDataToQueryStringAsync(): Promise<string | null> {
  const initData = await getInitDataAsync();
  if (!initData) return null;

  const params = new URLSearchParams();

  if (initData.user) {
    const userStr = JSON.stringify({
      id: initData.user.id,
      first_name: initData.user.first_name,
      ...(initData.user.username ? { username: initData.user.username } : {})
    });
    params.append('user', userStr);
  }

  params.append('auth_date', initData.auth_date.toString());
  params.append('hash', initData.hash);

  return params.toString();
}

