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

export interface VerificationResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
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
      console.log("在URL中未找到tgWebAppData参数");
      return null;
    }
    
    // 解码 URL 编码的数据
    const decodedData = decodeURIComponent(tgWebAppData[1]);
    console.log("解码后的tgWebAppData:", decodedData);
    
    // 解析参数
    const params = new URLSearchParams(decodedData);
    const userData = params.get('user');
    const authDate = params.get('auth_date');
    const hash = params.get('hash');
    const queryId = params.get('query_id');
    
    if (!userData) {
      console.log("在tgWebAppData中未找到用户数据");
      return null;
    }
    
    // 解析用户数据
    const user: TelegramUser = JSON.parse(decodeURIComponent(userData));
    console.log("解析到的用户数据:", user);
    
    // 构造返回数据
    const parsedData: ParsedInitData = {
      user,
      auth_date: authDate ? parseInt(authDate, 10) : undefined,
      hash: hash || undefined,
      query_id: queryId || undefined,
      rawInitData: decodedData
    };
    
    console.log("构造的解析数据:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("从URL解析Telegram数据时出错:", error);
    return null;
  }
};

/**
 * 获取 Telegram 用户数据
 * @returns Telegram 用户数据或 null
 */
export const getTelegramUser = (): TelegramUser | null => {
  console.log("调用getTelegramUser函数，检查Telegram Web App是否可用...");
  
  // 首先检查 Telegram Web App SDK 是否可用
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    console.log("Telegram Web App SDK可用:", webApp);
    
    // 获取用户信息
    const user = webApp.initDataUnsafe?.user;
    console.log("从SDK获取的Telegram用户数据:", user);
    
    return user || null;
  }
  
  // 如果 SDK 不可用，尝试从 URL 解析数据
  console.log("Telegram Web App SDK不可用，尝试从URL解析数据...");
  const urlData = parseTelegramDataFromUrl();
  if (urlData?.user) {
    console.log("从URL获取的Telegram用户数据:", urlData.user);
    return urlData.user;
  }
  
  console.log("Telegram Web App不可用", typeof window !== 'undefined' ? window.Telegram?.WebApp : 'window对象未定义');
  return null;
};

/**
 * 获取完整的 Telegram 初始化数据
 * @returns 解析后的初始化数据
 */
export const getTelegramInitData = (): ParsedInitData | null => {
  console.log("调用getTelegramInitData函数，检查Telegram Web App是否可用...");
  
  // 首先检查 Telegram Web App SDK 是否可用
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    console.log("Telegram Web App SDK可用:", webApp);
    
    // 获取原始初始化数据
    const rawInitData = webApp.initData;
    console.log("从SDK获取的原始初始化数据:", rawInitData);
    
    // 打印详细的安全相关信息（但不在这里解析敏感数据）
    console.log("初始化数据长度:", rawInitData?.length);
    console.log("是否包含用户数据:", !!webApp.initDataUnsafe?.user);
    console.log("是否包含认证时间:", !!webApp.initDataUnsafe?.auth_date);
    console.log("是否包含哈希值:", !!webApp.initDataUnsafe?.hash);
    
    if (!rawInitData) {
      console.log("SDK中无初始化数据");
      return null;
    }
    
    // 返回解析后的数据
    return {
      user: webApp.initDataUnsafe?.user,
      auth_date: webApp.initDataUnsafe?.auth_date,
      hash: webApp.initDataUnsafe?.hash,
      query_id: webApp.initDataUnsafe?.query_id,
      rawInitData
    };
  }
  
  // 如果 SDK 不可用，尝试从 URL 解析数据
  console.log("Telegram Web App SDK不可用，尝试从URL解析数据...");
  const urlData = parseTelegramDataFromUrl();
  if (urlData) {
    console.log("从URL获取的Telegram初始化数据:", urlData);
    return urlData;
  }
  
  console.log("Telegram Web App不可用", typeof window !== 'undefined' ? window.Telegram?.WebApp : 'window对象未定义');
  return null;
};

/**
 * 将 Telegram 初始化数据发送到后端进行验证
 * @param initData Telegram 初始化数据
 * @param endpoint 验证端点URL
 * @returns 后端验证响应
 */
export const verifyInitData = async (
  initData: string, 
  endpoint: string = '/api/telegram/verify'
): Promise<VerificationResponse> => {
  try {
    // 打印即将发送到后端的完整数据
    console.log("Sending to backend for verification:", { initData });
    
    // 发送到后端进行验证
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });
    
    const result: Record<string, unknown> = await response.json();
    
    // 打印后端响应的详细信息
    console.log("Backend response status:", response.status);
    console.log("Backend response headers:", [...response.headers.entries()]);
    console.log("Backend response data:", result);
    
    if (response.ok) {
      console.log("Telegram init data verification successful:", result);
      return { success: true, data: result };
    } else {
      console.error("Telegram init data verification failed:", result);
      return { success: false, error: (result.error as string) || 'Verification failed' };
    }
  } catch (error) {
    console.error("Error during Telegram init data verification:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * 使用示例函数（需要在组件中调用）
 * 获取用户数据并发送到后端验证
 */
export const useTelegramUser = async () => {
  // 获取 Telegram 初始化数据
  const initData = getTelegramInitData();
  
  if (initData) {
    // 打印详细的原始initData
    console.log("Detailed Raw Init Data:", initData.rawInitData);
    console.log("Parsed Init Data Details:", {
      user: initData.user,
      auth_date: initData.auth_date,
      hash: initData.hash,
      query_id: initData.query_id
    });
    
    // 发送到后端验证
    const verificationResult = await verifyInitData(initData.rawInitData);
    
    if (verificationResult.success) {
      console.log("User verified successfully");
      return {
        user: initData.user,
        verified: true,
        verificationData: verificationResult.data
      };
    } else {
      console.error("User verification failed:", verificationResult.error);
      return {
        user: initData.user,
        verified: false,
        error: verificationResult.error
      };
    }
  }
  
  return {
    user: null,
    verified: false,
    error: "Telegram Web App not available"
  };
};