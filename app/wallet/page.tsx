"use client";
// 钱包主页，生成钱包，查询余额，转账等，使用viem.js
import React, { useState, useEffect } from "react";
import { getWalletClient, sepoliaClient } from "./createByPrivate";
import {
  parseEther,
  parseGwei,
  encodeAbiParameters,
  decodeAbiParameters,
  encodeFunctionData
} from "viem";
import { abi } from "./abi";

export default function Wallet() {
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenBalance, settokenBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);

  const walletClient = getWalletClient();
  const account = walletClient.account;
  const userAddress = account.address;
  const tokenAddress = "0x24b4D4Fa94aE6dBe31621814868cc6Ea27fb1EBB";

  useEffect(() => {
    setAddress(userAddress);
  }, [userAddress]);

  const fetchBalance = async () => {
    const balance = await sepoliaClient.getBalance({
      address: userAddress,
    });
    setBalance(balance.toString());
  };

  // TODO 查询 ERC20 代币余额
  const fetchTokenBalance = async () => {
    const data = await sepoliaClient.readContract({
      address: tokenAddress,
      abi: abi,
      functionName: "balanceOf",
      args: [userAddress],
    });
    settokenBalance((data as string).toString());
  };

  const send = async () => {
    const nonce = await sepoliaClient.getTransactionCount({
      address: userAddress,
    });
    // const txParams = {
    //   account: account,
    //   to: toAddress, // 目标地址
    //   value: parseEther("0.0001"), // 发送金额（ETH）
    //   chainId: sepolia.id,

    //   // EIP-1559 交易
    //   maxFeePerGas: parseGwei("40"), // 最大总费用（基础费用+小费）
    //   maxPriorityFeePerGas: parseGwei("2"), // 最大小费

    //   gas: 21000n, // 普通交易 - gas limit
    //   nonce: nonce,
    // };
    // console.log("Transaction Params:", txParams);
    // const gasEstimate = await sepoliaClient.estimateGas(txParams)
    // txParams.gas = gasEstimate

    const currentGasPrice = await sepoliaClient.getGasPrice(); // 获取当前 Gas 价格
    const maxFeePerGas = currentGasPrice + parseGwei("5"); // maxFeePerGas 设置为当前 gas + 5 Gwei
    const maxPriorityFeePerGas = parseGwei("2"); // 设置适中的 maxPriorityFeePerGas

    // 构建交易
    const request = await walletClient.prepareTransactionRequest({
      from: account.address,
      to: toAddress as any,
      value: parseEther(amount),
      data: "0x",
      type: "eip1559",
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce: nonce,
    });
    const gasEstimate = await sepoliaClient.estimateGas(request);
    request.gas = gasEstimate;

    // 签名交易
    const signedTx = await account.signTransaction(request);
    console.log("Signed Transaction:", signedTx);
    // 7. 发送交易  eth_sendRawTransaction
    const hash = await sepoliaClient.sendRawTransaction({
      serializedTransaction: signedTx,
    });
    setTxHash(hash);
  };

  // 发送 ERC20 代币
  const sendToken = async () => {
    const nonce = await sepoliaClient.getTransactionCount({
      address: userAddress,
    });

    const currentGasPrice = await sepoliaClient.getGasPrice(); // 获取当前 Gas 价格
    const maxFeePerGas = currentGasPrice + parseGwei("5"); // maxFeePerGas 设置为当前 gas + 5 Gwei
    const maxPriorityFeePerGas = parseGwei("2"); // 设置适中的 maxPriorityFeePerGas

    // const data = encodeAbiParameters(abi[0].inputs, [toAddress, amount]);
    const data = encodeFunctionData({
        abi: abi,
        functionName: 'transfer', 
        args: [toAddress, parseEther(amount)]
      })

    // 构建交易
    const request = await walletClient.prepareTransactionRequest({
      from: account.address,
      to: tokenAddress,
      value: 0n,
      data,
      type: "eip1559",
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce: nonce,
    });

    // 签名交易
    const signedTx = await account.signTransaction(request);
    console.log("Signed Transaction:", signedTx);
    // 7. 发送交易  eth_sendRawTransaction
    const hash = await sepoliaClient.sendRawTransaction({
      serializedTransaction: signedTx,
    });
    setTxHash(hash);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Wallet</h1>
      <button onClick={fetchBalance} style={{ background: "blue" }}>
        Fetch Balance
      </button>
      <div>
        <h2>Balance: {balance}</h2>
      </div>
      <button onClick={fetchTokenBalance} style={{ background: "blue" }}>
        Fetch TokenBalance
      </button>
      <div>
        <h2>TokenBalance: {tokenBalance}</h2>
      </div>
      <div>
        <h2>Address: {address}</h2>
      </div>
      <div>
        <h2 style={{ marginTop: "20px" }}>Send Transaction</h2>
        <input
          type="text"
          placeholder="To Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          style={{ color: "black" }}
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
          onClick={send}
          style={{ background: "blue", marginTop: "10px" }}
        >
          Send ETH
        </button>
        <br />
        <button
          onClick={sendToken}
          style={{ background: "blue", marginTop: "10px" }}
        >
          Send ERC20 Token
        </button>
      </div>
      <div>
        <h2>Transaction Hash:</h2>
        <p>{txHash}</p>
      </div>
    </div>
  );
}
