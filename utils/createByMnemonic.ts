/**
 * 用助记词生成账户
 */

import { english, generateMnemonic as generateMnemonic_ } from 'viem/accounts'
 
export function generateMnemonic(): string {
    return generateMnemonic_(english);
  }
