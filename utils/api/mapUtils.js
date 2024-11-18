import { gaodeSecurityKey } from '@/config/keys';
import CryptoJS from 'crypto-js';

export function signRequest(params) {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const signStr = `${sortedParams}${gaodeSecurityKey}`;
  const sign = CryptoJS.MD5(signStr).toString();
  return `${sortedParams}&sig=${sign}`;
}