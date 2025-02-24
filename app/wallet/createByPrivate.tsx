import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

// 使用类型断言将 privateKey 显式转换为 string 类型
export function getWalletClient() {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });
}

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http("https://1rpc.io/sepolia"),
});
