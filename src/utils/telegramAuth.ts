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
  // 解析 initData 参数
  const params = new URLSearchParams(initData);
  
  // 获取必要的参数
  const hash = params.get('hash');
  const authDate = params.get('auth_date');
  
  if (!hash || !authDate) {
    return false;
  }
  
  // 检查 auth_date 是否在合理范围内（例如，不超过1天）
  const authDateInt = parseInt(authDate, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - authDateInt > 86400) { // 24 hours
    return false;
  }
  
  // 准备用于签名的数据
  const dataCheckString = Array.from(params.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // 生成密钥
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  // 生成签名
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  // 比较签名
  return calculatedHash === hash;
}

/**
 * 解析 Telegram Web App 的 initData
 * @param initData Telegram Web App 的 initData 字符串
 * @returns 解析后的数据对象
 */
export function parseTelegramInitData(initData: string): ParsedTelegramInitData {
  const params = new URLSearchParams(initData);
  const result: ParsedTelegramInitData = {};
  
  for (const [key, value] of params.entries()) {
    // user 字段是 JSON 字符串，需要解析
    if (key === 'user') {
      try {
        result[key] = JSON.parse(decodeURIComponent(value)) as TelegramWebAppUser;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // 如果解析失败，保留原始字符串值
        result[key] = undefined;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}