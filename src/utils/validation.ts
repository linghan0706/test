/**
 * 验证TON地址格式
 * @param address - 地址字符串
 * @returns 是否为有效地址
 */
export function isValidTonAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }
  
  // TON地址通常是48个字符的base64编码
  // 这里使用简单的正则表达式验证
  const tonAddressRegex = /^[A-Za-z0-9+/]{48}$/
  const friendlyAddressRegex = /^[A-Za-z0-9_-]{48}$/
  
  return tonAddressRegex.test(address) || friendlyAddressRegex.test(address)
}

/**
 * 验证金额格式
 * @param amount - 金额字符串
 * @returns 是否为有效金额
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || typeof amount !== 'string') {
    return false
  }
  
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * 验证交易哈希
 * @param hash - 交易哈希
 * @returns 是否为有效哈希
 */
export function isValidTransactionHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') {
    return false
  }
  
  // 交易哈希通常是64个字符的十六进制字符串
  const hashRegex = /^[a-fA-F0-9]{64}$/
  return hashRegex.test(hash)
}

/**
 * 验证网络类型
 * @param network - 网络类型
 * @returns 是否为有效网络
 */
export function isValidNetwork(network: string): network is 'mainnet' | 'testnet' {
  return network === 'mainnet' || network === 'testnet'
}

/**
 * 验证URL格式
 * @param url - URL字符串
 * @returns 是否为有效URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}