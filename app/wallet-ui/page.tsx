"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useReadContract, useWriteContract } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { abi } from "./abi";

export default function WalletUI() {
  const { allAccounts, address, isConnected } = useAppKitAccount();
  const tokenAddress = "0x24b4D4Fa94aE6dBe31621814868cc6Ea27fb1EBB";
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<string | null>(null);

  const {
    data: hash,
    writeContract,
    isSuccess,
    error,
    isPending,
  } = useWriteContract();
  const readContract = useReadContract({
    address: tokenAddress,
    abi: abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: false },
  });

  const onRead = useCallback(async () => {
    try {
      const data = await readContract.refetch();
      setBalance(data.data as string);
    } catch (error) {
      console.error("读取余额失败:", error);
    }
  }, [readContract]);

  const onSend = () => {
    if (!isConnected || !address) {
      console.error("用户未连接钱包或没有选中地址");
      return;
    }
    if (!toAddress || !/^(0x)?[0-9a-fA-F]{40}$/.test(toAddress)) {
      console.error("无效的目标地址");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error("无效的金额");
      return;
    }

    try {
      console.log("正在发送交易...");
      writeContract({
        address: tokenAddress,
        abi: abi,
        functionName: "transfer",
        args: [toAddress, BigInt(amount)],
      });
      console.log("交易已发送！");
    } catch (error) {
      console.error("发送交易失败:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("交易成功，Hash:", hash);
      onRead();
    }
    if (error) {
      console.error("交易失败:", error.message);
    }
  }, [isSuccess, error, hash, onRead]);

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
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
      >
        <h2>Token Address: {tokenAddress}</h2>
        <div>
          <h2>Balance: {balance}</h2>
          <button
            onClick={onRead}
            style={{ background: "blue", marginTop: "10px" }}
          >
            Query Balance
          </button>
        </div>
        <div>
          <h2>Send Transaction</h2>
          <input
            type="text"
            placeholder="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={{ marginTop: "10px", color: "black" }}
          />
          <br />
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
