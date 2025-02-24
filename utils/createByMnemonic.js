"use strict";
/**
 * 用助记词生成账户
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mnemonic = void 0;
var accounts_1 = require("viem/accounts");
exports.mnemonic = (0, accounts_1.generateMnemonic)(accounts_1.english);
console.log(exports.mnemonic);
