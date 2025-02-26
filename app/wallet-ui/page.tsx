"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import {
  useReadContract,
  useWriteContract,
  useSignMessage,
  useSignTypedData,
} from "wagmi";
import { sepolia } from "viem/chains";
import { useState, useEffect, useCallback } from "react";
import { tokenBankABI, ERC20ABI } from "./abi";
import { parseSignature } from "viem";

export default function WalletUI() {
  const { allAccounts, address, isConnected } = useAppKitAccount();
  // const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [tokenBankAddress, setTokenBankAddress] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null);
  // const tokenAddress = "0xE188f6376fcaA542F200Fd5071420b69042CbF0D";
  // const tokenBankAddress = "0x7ad39619C806Ab9e549dC0537B26Ce9B20d8BF2f";

  const {
    data: hash,
    writeContract,
    isSuccess,
    error,
    isPending,
  } = useWriteContract();
  const readToken = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: false },
  });
  const readContract = useReadContract({
    address: tokenBankAddress as `0x${string}`,
    abi: tokenBankABI,
    functionName: "getDepositBalance",
    args: [address as `0x${string}`],
    query: { enabled: false },
  });
  const readNonce = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "nonces",
    args: [address as `0x${string}`],
    query: { enabled: false },
  });
  const { signMessage } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();

  // EIP-712 域和类型，name 和 version 是Token代币的信息
  const domain = {
    name: tokenName,
    version: "1",
    chainId: sepolia.id,
    verifyingContract: tokenAddress,
  } as const;

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  const onReadToken = useCallback(async () => {
    try {
      const data = await readToken.refetch();
      setTokenBalance(data.data ? data.data.toString() : null);
    } catch (error) {
      console.error("读取余额失败:", error);
    }
  }, [readToken]);

  const onRead = useCallback(async () => {
    try {
      const data = await readContract.refetch();
      setBalance(data.data ? data.data.toString() : null);
    } catch (error) {
      console.error("读取余额失败:", error);
    }
  }, [readContract]);

  const onSend = async () => {
    if (!isConnected || !address) {
      console.error("用户未连接钱包或没有选中地址");
      return;
    }
    // if (!toAddress || !/^(0x)?[0-9a-fA-F]{40}$/.test(toAddress)) {
    //   console.error("无效的目标地址");
    //   return;
    // }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error("无效的金额");
      return;
    }

    try {
      console.log("正在发送交易...");

      // const message = `Welcome to OpenSpace!`;
      // 1天后过期
      const deadline = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      // 签名消息
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: "Permit",
        message: {
          owner: address as `0x${string}`,
          spender: tokenBankAddress as `0x${string}`,
          value: BigInt(amount),
          nonce: BigInt((await readNonce.refetch()).data ?? 0),
          deadline: BigInt(deadline),
        },
      });
      console.log("签名信息:", signature);
      // 分割签名
      const { v, r, s } = parseSignature(signature);

      writeContract({
        address: tokenBankAddress as `0x${string}`,
        abi: tokenBankABI,
        functionName: "permitDeposit",
        args: [
          address as `0x${string}`,
          tokenBankAddress as `0x${string}`,
          BigInt(amount),
          BigInt(deadline),
          Number(v),
          r,
          s,
        ],
      });
      console.log("交易已发送！");
    } catch (error) {
      console.error("发送交易失败:", error);
    }
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     console.log("交易成功，Hash:", hash);
  //     onRead();
  //   }
  //   if (error) {
  //     console.error("交易失败:", error.message);
  //   }
  // }, [isSuccess, error, hash, onRead]);

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
      <h1>Wallet UI</h1>
      <p>Welcome to wallet UI!</p>
      {/* @ts-expect-error msg */}
      <appkit-button />
      <div>
        <h2>Current Address List: </h2>
        <ul>
          {allAccounts.map((account) => (
            <li style={{ color: "blue" }} key={account.address}>
              {account.address}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Connection Status: {isConnected ? "Connected" : "Disconnected"}</h2>
      </div>
      <div>
        <h2>Current Address: {address ? address : null}</h2>
      </div>
      <div>
        <input
          type="text"
          placeholder="tokenAddress"
          value={tokenAddress ?? ""}
          onChange={(e) => setTokenAddress(e.target.value)}
          style={{ marginTop: "10px", color: "black" }}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="tokenBankAddress"
          value={tokenBankAddress ?? ""}
          onChange={(e) => setTokenBankAddress(e.target.value)}
          style={{ marginTop: "10px", color: "black" }}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="tokenName"
          value={tokenName ?? ""}
          onChange={(e) => setTokenName(e.target.value)}
          style={{ marginTop: "10px", color: "black" }}
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
      >
        <h2>Token Address: {tokenAddress}</h2>
        <div>
          <h2>Token Balance: {tokenBalance}</h2>
          <button
            onClick={onReadToken}
            style={{ background: "blue", marginTop: "10px" }}
          >
            Query Token Balance
          </button>
        </div>
        <h2 style={{ marginTop: "10px" }}>
          Token Bank Address: {tokenBankAddress}
        </h2>
        <div>
          <h2>Token Bank Balance: {balance}</h2>
          <button
            onClick={onRead}
            style={{ background: "blue", marginTop: "10px" }}
          >
            Query Balance
          </button>
        </div>
        <div>
          <h2>Send Transaction to TokenBank</h2>
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ marginTop: "10px", color: "black" }}
          />
          <br />
          <button
            onClick={onSend}
            style={{ background: "blue", marginTop: "10px" }}
            disabled={isPending}
          >
            {isPending ? "正在发送..." : "Transfer ERC20 Token"}
          </button>
          <div>
            {isPending && <p>交易正在处理中...</p>}
            {hash && <p>交易 Hash: {hash}</p>}
            {error && <p style={{ color: "red" }}>错误: {error.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
