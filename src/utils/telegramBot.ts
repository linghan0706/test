import { useWebApp, useInitData, WebAppUser } from '@vkruglikov/react-telegram-web-app';

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
  language_code?: string;
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
 * 将 WebAppUser 转换为 TelegramUser
 * 处理类型差异和属性映射
 */
const convertWebAppUserToTelegramUser = (webAppUser: WebAppUser): TelegramUser => {
  return {
    id: webAppUser.id,
    first_name: webAppUser.first_name,
    last_name: webAppUser.last_name,
    username: webAppUser.username,
    language_code: webAppUser.language_code,
    // WebAppUser 中没有这些属性，设置为默认值
    is_premium: undefined,
    added_to_attachment_menu: undefined,
    allows_write_to_pm: undefined,
    // 处理 photo_url 的类型差异：WebAppUser 中是 true | undefined
    photo_url: webAppUser.photo_url === true ? undefined : undefined,
  };
};

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
 * React Hook: 获取当前 Telegram 用户信息
 * 使用 @vkruglikov/react-telegram-web-app 库
 * @returns Telegram 用户数据或 null
 */
export const useTelegramUser = (): TelegramUser | null => {
  const [initDataUnsafe] = useInitData();
  
  if (!initDataUnsafe?.user) {
    return null;
  }
  
  return convertWebAppUserToTelegramUser(initDataUnsafe.user);
};

/**
 * React Hook: 获取完整的 Telegram 初始化数据
 * 使用 @vkruglikov/react-telegram-web-app 库
 * @returns 解析后的初始化数据
 */
export const useTelegramInitData = (): ParsedInitData | null => {
  const webApp = useWebApp();
  const [initDataUnsafe, initData] = useInitData();
  
  console.log('开始获取 Telegram 初始化数据...')
  
  // 获取调试信息
  const debugInfo = getTelegramDebugInfo()
  console.log('Telegram 环境调试信息:', debugInfo)
  
  if (!webApp || !initData) {
    console.log('无法获取 Telegram 初始化数据')
    return null;
  }
  
  console.log('从 @vkruglikov/react-telegram-web-app 获取的数据:', {
    user: initDataUnsafe?.user,
    auth_date: initDataUnsafe?.auth_date,
    hash: initDataUnsafe?.hash,
    query_id: initDataUnsafe?.query_id,
    rawInitData: initData
  })
  
  return {
    user: initDataUnsafe?.user ? convertWebAppUserToTelegramUser(initDataUnsafe.user) : undefined,
    auth_date: initDataUnsafe?.auth_date,
    hash: initDataUnsafe?.hash,
    query_id: initDataUnsafe?.query_id,
    rawInitData: initData
  };
};

/**
 * React Hook: 获取 Telegram WebApp 实例
 * 使用 @vkruglikov/react-telegram-web-app 库
 * @returns Telegram WebApp 实例
 */
export const useTelegramWebApp = () => {
  return useWebApp();
};

// 兼容性函数 - 保持向后兼容
/**
 * 获取 Telegram 用户数据 (兼容性函数)
 * @deprecated 请使用 useTelegramUser hook 替代
 * @returns Telegram 用户数据或 null
 */
export const getTelegramUser = (): TelegramUser | null => {
  console.warn('getTelegramUser 已废弃，请在 React 组件中使用 useTelegramUser hook');
  
  // 首先检查 Telegram Web App SDK 是否可用
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    const user = webApp.initDataUnsafe?.user;
    return user || null;
  }
  
  return null;
};

/**
 * 获取完整的 Telegram 初始化数据 (兼容性函数)
 * @deprecated 请使用 useTelegramInitData hook 替代
 * @returns 解析后的初始化数据
 */
export const getTelegramInitData = (): ParsedInitData | null => {
  console.warn('getTelegramInitData 已废弃，请在 React 组件中使用 useTelegramInitData hook');
  
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp
    const rawInitData = webApp.initData
    
    if (!rawInitData) {
      return null
    }
    
    return {
      user: webApp.initDataUnsafe?.user,
      auth_date: webApp.initDataUnsafe?.auth_date, 
      hash: webApp.initDataUnsafe?.hash,
      query_id: webApp.initDataUnsafe?.query_id,
      rawInitData: rawInitData
    }
  }
  
  return null
}

/**
 * 获取格式化的 Telegram 初始化数据字符串 (兼容性函数)
 * @deprecated 请使用 useTelegramInitData hook 替代
 * @returns 格式化的初始化数据字符串
 */
export const getFormattedTelegramInitData = (): string | null => {
  console.warn('getFormattedTelegramInitData 已废弃，请在 React 组件中使用 useTelegramInitData hook');
  
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

// 示例组件用法
/*
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { useTelegramUser, useTelegramInitData, useTelegramWebApp } from './utils/telegramBot';

function MyComponent() {
  const webApp = useTelegramWebApp();
  const user = useTelegramUser();
  const initData = useTelegramInitData();

  useEffect(() => {
    if (webApp) {
      // 获取 initData
      console.log("initData:", initData?.rawInitData);

      // 获取用户信息（直接解析）
      console.log("User:", user);
    }
  }, [webApp, user, initData]);

  return <div>...</div>;
}

// 在应用根部使用 WebAppProvider
function App() {
  return (
    <WebAppProvider>
      <MyComponent />
    </WebAppProvider>
  );
}
*/