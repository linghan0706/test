// Telegram Web App SDK
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
 * 获取 Telegram 用户数据
 * @returns Telegram 用户数据或 null
 */
export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // 获取用户信息
    const user = webApp.initDataUnsafe?.user;
    console.log("Telegram User Data:", user);
    
    return user || null;
  }
  
  console.log("Telegram Web App is not available");
  return null;
};

/**
 * 获取完整的 Telegram 初始化数据
 * @returns 解析后的初始化数据
 */
export const getTelegramInitData = (): ParsedInitData | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // 获取原始初始化数据
    const rawInitData = webApp.initData;
    console.log("Telegram Raw Init Data:", rawInitData);
    
    if (!rawInitData) {
      console.log("No init data available");
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
  
  console.log("Telegram Web App is not available");
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
    // 发送到后端进行验证
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });
    
    const result: Record<string, unknown> = await response.json();
    
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
    // 打印解析后的数据
    console.log("Parsed Init Data:", initData);
    
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