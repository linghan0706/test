/**
 * 格式化TON金额
 * @param amount - 金额字符串或数字
 * @param decimals - 小数位数，默认为9
 * @returns 格式化后的金额字符串
 */
export function formatTonAmount(amount: string | number, decimals: number = 9): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '0'
  
  const divisor = Math.pow(10, decimals)
  const formatted = (num / divisor).toFixed(4)
  
  // 移除尾随的零
  return formatted.replace(/\.?0+$/, '')
}

/**
 * 格式化地址显示
 * @param address - 完整地址
 * @param startLength - 开始显示的字符数
 * @param endLength - 结尾显示的字符数
 * @returns 格式化后的地址
 */
export function formatAddress(
  address: string, 
  startLength: number = 6, 
  endLength: number = 4
): string {
  if (!address || address.length <= startLength + endLength) {
    return address
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * 格式化时间戳
 * @param timestamp - 时间戳（秒或毫秒）
 * @param locale - 语言环境
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(timestamp: number, locale: string = 'zh-CN'): string {
  // 如果是秒级时间戳，转换为毫秒
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(ms))
}

/**
 * 格式化数字显示
 * @param num - 数字
 * @param options - 格式化选项
 * @returns 格式化后的数字字符串
 */
export function formatNumber(
  num: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(num)
}