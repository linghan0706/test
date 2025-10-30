declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: TelegramUser;
          auth_date?: number;
          hash?: string;
          query_id?: string;
        };
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramInitData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
  query_id?: string;
}

export interface ParsedInitData {
  user?: TelegramUser;
  auth_date?: number;
  hash?: string;
  query_id?: string;
  rawInitData: string;
}

/**
 * 从 URL 中解析 Telegram Web App 数据
 * @returns Telegram 初始化数据或 null
 */
const parseTelegramDataFromUrl = (): ParsedInitData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // 获取当前 URL
    const url = new URL(window.location.href);
    const tgWebAppData = url.hash.match(/tgWebAppData=([^&]*)/);
    
    if (!tgWebAppData || !tgWebAppData[1]) {
      return null;
    }
    
    // 解码 URL 编码的数据
    const decodedData = decodeURIComponent(tgWebAppData[1]);
    
    // 解析参数
    const params = new URLSearchParams(decodedData);
    const userData = params.get('user');
    const authDate = params.get('auth_date');
    const hash = params.get('hash');
    const queryId = params.get('query_id');
    
    if (!userData) {
      return null;
    }
    
    // 解析用户数据
    let user: TelegramUser | null = null;
    try {
      user = JSON.parse(decodeURIComponent(userData));
    } catch (error) {
      return null;
    }
    
    // 构造返回数据
    const parsedData: ParsedInitData = {
      user: user || undefined,
      auth_date: authDate ? parseInt(authDate, 10) : undefined,
      hash: hash || undefined,
      query_id: queryId || undefined,
      rawInitData: decodedData
    };
    
    return parsedData;
  } catch (error) {
    return null;
  }
};

/**
 * 获取 Telegram 用户数据
 * @returns Telegram 用户数据或 null
 */
export const getTelegramUser = (): TelegramUser | null => {
  // 首先检查 Telegram Web App SDK 是否可用
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // 获取用户信息
    const user = webApp.initDataUnsafe?.user;
    
    return user || null;
  }
  
  // 如果 SDK 不可用，尝试从 URL 解析数据
  const urlData = parseTelegramDataFromUrl();
  if (urlData?.user) {
    return urlData.user;
  }
  
  return null;
};

/**
 * 获取完整的 Telegram 初始化数据
 * @returns 解析后的初始化数据
 */
export const getTelegramInitData = (): ParsedInitData | null => {
  // 首先检查 Telegram Web App SDK 是否可用
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // 获取原始初始化数据
    const rawInitData = webApp.initData;
    
    if (!rawInitData) {
      return null;
    
    }
    
    // 返回解析后的数据
    return {
      user: webApp.initDataUnsafe?.user,
      auth_date: webApp.initDataUnsafe?.auth_date, 
      hash: webApp.initDataUnsafe?.hash,
      rawInitData: rawInitData
    };
  }
  
  // 如果 SDK 不可用，尝试从 URL 解析数据
  const urlData = parseTelegramDataFromUrl();
  if (urlData) {
    return urlData;
  }
  
  return null;
};

/**
 * 获取格式化的 Telegram 初始化数据字符串
 * @returns 格式化的初始化数据字符串
 */
export const getFormattedTelegramInitData = (): string | null => {
  const initData = getTelegramInitData();
  
  if (!initData) {
    return null;
  }
  
  const { user, auth_date, hash } = initData;
  
  // 构造格式化的字符串
  const formattedString = `// 完整格式示例
const initData = "user=${encodeURIComponent(JSON.stringify(user))}&auth_date=${auth_date}&hash=${hash}";

// URL解码后的格式
user=${JSON.stringify(user)}&auth_date=${auth_date}&hash=${hash}`;
  
  return formattedString;
};