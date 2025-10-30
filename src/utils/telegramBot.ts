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
        version?: string;
        platform?: string;
        colorScheme?: string;
        themeParams?: Record<string, unknown>;
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
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
 * 检测是否在 Telegram Web App 环境中运行
 * @returns {boolean} 是否在 Telegram 环境中
 */
export function isTelegramEnvironment(): boolean {
  // 检查 Telegram Web App SDK
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return true
  }
  
  // 检查 URL 中是否包含 tgWebAppData
  if (typeof window !== 'undefined' && window.location.hash.includes('tgWebAppData=')) {
    return true
  }
  
  // 检查 User Agent 是否包含 Telegram 相关信息
  if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Telegram')) {
    return true
  }
  
  return false
}

/**
 * 获取 Telegram Web App 调试信息
 * @returns {object} 调试信息对象
 */
export function getTelegramDebugInfo(): {
  hasTelegramWebApp: boolean
  hasInitData: boolean
  userAgent: string
  url: string
  webAppData?: Record<string, unknown>
} {
  const debugInfo = {
    hasTelegramWebApp: typeof window !== 'undefined' && !!window.Telegram?.WebApp,
    hasInitData: typeof window !== 'undefined' && window.location.hash.includes('tgWebAppData='),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    url: typeof window !== 'undefined' ? window.location.href : '',
    webAppData: undefined as Record<string, unknown> | undefined
  }
  
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    debugInfo.webAppData = {
      initData: window.Telegram.WebApp.initData,
      initDataUnsafe: window.Telegram.WebApp.initDataUnsafe,
      version: window.Telegram.WebApp.version,
      platform: window.Telegram.WebApp.platform,
      colorScheme: window.Telegram.WebApp.colorScheme,
      themeParams: window.Telegram.WebApp.themeParams,
      isExpanded: window.Telegram.WebApp.isExpanded,
      viewportHeight: window.Telegram.WebApp.viewportHeight,
      viewportStableHeight: window.Telegram.WebApp.viewportStableHeight
    }
  }
  
  return debugInfo
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
    } catch {
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
  } catch {
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
  console.log('开始获取 Telegram 初始化数据...')
  
  // 获取调试信息
  const debugInfo = getTelegramDebugInfo()
  console.log('Telegram 环境调试信息:', debugInfo)
  
  // 首先检查 Telegram Web App SDK 是否可用
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp
    console.log('检测到 Telegram Web App SDK')
    
    // 获取原始初始化数据
    const rawInitData = webApp.initData
    console.log('原始初始化数据:', rawInitData)
    
    if (!rawInitData) {
      console.log('警告: Telegram Web App SDK 可用但没有初始化数据')
      
      // 在调试模式下，检查是否有 initDataUnsafe
      if (webApp.initDataUnsafe && Object.keys(webApp.initDataUnsafe).length > 0) {
        console.log('发现 initDataUnsafe 数据:', webApp.initDataUnsafe)
        
        // 尝试构造一个基本的 rawInitData
        const constructedData = new URLSearchParams()
        if (webApp.initDataUnsafe.user) {
          constructedData.append('user', JSON.stringify(webApp.initDataUnsafe.user))
        }
        if (webApp.initDataUnsafe.auth_date) {
          constructedData.append('auth_date', webApp.initDataUnsafe.auth_date.toString())
        }
        if (webApp.initDataUnsafe.hash) {
          constructedData.append('hash', webApp.initDataUnsafe.hash)
        }
        if (webApp.initDataUnsafe.query_id) {
          constructedData.append('query_id', webApp.initDataUnsafe.query_id)
        }
        
        const constructedRawData = constructedData.toString()
        console.log('构造的原始数据:', constructedRawData)
        
        if (constructedRawData) {
          return {
            user: webApp.initDataUnsafe.user,
            auth_date: webApp.initDataUnsafe.auth_date,
            hash: webApp.initDataUnsafe.hash,
            query_id: webApp.initDataUnsafe.query_id,
            rawInitData: constructedRawData
          }
        }
      }
      
      return null
    }
    
    // 返回解析后的数据
    const result = {
      user: webApp.initDataUnsafe?.user,
      auth_date: webApp.initDataUnsafe?.auth_date, 
      hash: webApp.initDataUnsafe?.hash,
      query_id: webApp.initDataUnsafe?.query_id,
      rawInitData: rawInitData
    }
    
    console.log('从 Telegram Web App SDK 获取的数据:', result)
    return result
  }
  
  console.log('Telegram Web App SDK 不可用，尝试从 URL 解析数据')
  
  // 如果 SDK 不可用，尝试从 URL 解析数据
  const urlData = parseTelegramDataFromUrl()
  if (urlData) {
    console.log('从 URL 解析的数据:', urlData)
    return urlData
  }
  
  console.log('无法获取 Telegram 初始化数据')
  return null
}

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