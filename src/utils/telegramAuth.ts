import crypto from 'crypto';

/**
 * Telegram 用户信息接口
 */
export interface TelegramWebAppUser {
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

/**
 * 解析后的 Telegram 初始化数据接口
 */
export interface ParsedTelegramInitData {
  user?: TelegramWebAppUser;
  auth_date?: string;
  hash?: string;
  query_id?: string;
  [key: string]: string | TelegramWebAppUser | undefined;
}

/**
 * 验证 Telegram Web App 的 initData
 * @param initData Telegram Web App 的 initData 字符串
 * @param botToken Telegram Bot Token
 * @returns 验证是否成功
 */
export function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  try {
    console.log("开始验证Telegram Web App数据");
    console.log("initData长度:", initData.length);
    console.log("botToken长度:", botToken.length);
    
    // 解析 initData 参数
    const params = new URLSearchParams(initData);
    console.log("解析initData参数:", [...params.entries()]);
    
    // 获取必要的参数
    const hash = params.get('hash');
    const authDate = params.get('auth_date');
    
    console.log("提取的hash和authDate:", { hash, authDate });
    
    if (!hash || !authDate) {
      console.log("缺少必需的参数(hash或authDate)");
      return false;
    }
    
    // 检查 auth_date 是否在合理范围内（例如，不超过1天）
    const authDateInt = parseInt(authDate, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("时间检查:", { authDateInt, currentTime, diff: currentTime - authDateInt });
    
    if (isNaN(authDateInt)) {
      console.log("auth_date不是有效数字");
      return false;
    }
    
    if (currentTime - authDateInt > 86400) { // 24 hours
      console.log("认证数据已过期(超过24小时)");
      return false;
    }
    
    // 准备用于签名的数据
    const dataCheckString = Array.from(params.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    console.log("用于签名的数据字符串长度:", dataCheckString.length);
    console.log("用于签名的数据字符串预览:", dataCheckString.substring(0, 200) + (dataCheckString.length > 200 ? '...' : ''));
    
    // 生成密钥
    console.log("开始生成密钥");
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    console.log("生成的密钥长度:", secretKey.length);
    
    // 生成签名
    console.log("开始生成签名");
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    console.log("计算出的hash:", calculatedHash);
    console.log("提供的hash:", hash);
    console.log("hash匹配结果:", calculatedHash === hash);
    
    // 比较签名
    return calculatedHash === hash;
  } catch (error) {
    console.error("验证Telegram Web App数据时发生错误:", error);
    return false;
  }
}

/**
 * 解析 Telegram Web App 的 initData
 * @param initData Telegram Web App 的 initData 字符串
 * @returns 解析后的数据对象
 */
export function parseTelegramInitData(initData: string): ParsedTelegramInitData {
  try {
    console.log("开始解析Telegram初始化数据:", initData);
    const params = new URLSearchParams(initData);
    const result: ParsedTelegramInitData = {};
    
    for (const [key, value] of params.entries()) {
      console.log("处理参数:", { key, value });
      // user 字段是 JSON 字符串，需要解析
      if (key === 'user') {
        try {
          result[key] = JSON.parse(decodeURIComponent(value)) as TelegramWebAppUser;
          console.log("解析user数据成功:", result[key]);
        } catch (error) {
          console.error('解析用户数据失败:', error);
          // 如果解析失败，保留原始字符串值
          result[key] = undefined;
        }
      } else {
        result[key] = value;
      }
    }
    
    console.log("解析完成的结果:", result);
    return result;
  } catch (error) {
    console.error("解析Telegram初始化数据时发生错误:", error);
    return {};
  }
}