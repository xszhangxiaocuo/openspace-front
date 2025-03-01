"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import {
  useReadContract,
  useWriteContract,
  useSignMessage,
  useSignTypedData,
  useVerifyTypedData
} from "wagmi";
import { sepolia } from "viem/chains";
import { useState, useEffect, useCallback } from "react";
import { NFTABI, NFTMarketABI, ERC20ABI } from "./abi";
import { parseSignature } from "viem";

export default function NFTMarket() {
  const { allAccounts, address, isConnected } = useAppKitAccount();
  // const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(
    "0xE188f6376fcaA542F200Fd5071420b69042CbF0D"
  );
  const [NFTAddress, setNFTAddress] = useState<string | null>(
    "0x07D3130751B589fD46133deB1E0c67D5D4626922"
  );
  const [NFTMarketAddress, setNFTMarketAddress] = useState<string | null>(
    "0x0496796138812516ce81b4a06149fBe2e50fBCe0"
  );
  const [whiteAddress, setWhiteAddress] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>("Hoshino");

  const [tokenId, setTokenId] = useState<string | null>(null);
  const [tokenOwner, setTokenOwner] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState<string | null>(null);
  // const tokenAddress = "0xE188f6376fcaA542F200Fd5071420b69042CbF0D";
  // const tokenBankAddress = "0x7ad39619C806Ab9e549dC0537B26Ce9B20d8BF2f";
  const [v1, setV1] = useState<number | null>(null);
  const [r1, setR1] = useState<string | null>(null);
  const [s1, setS1] = useState<string | null>(null);


  // const deadline = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const deadline = 1740900988;  

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
  const readNFTOwner = useReadContract({
    address: NFTAddress as `0x${string}`,
    abi: NFTABI,
    functionName: "ownerOf",
    args: [tokenId ? BigInt(tokenId) : BigInt(0)],
    query: { enabled: false },
  });
  const readNonce = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20ABI,
    functionName: "nonces",
    args: [address as `0x${string}`],
    query: { enabled: false },
  });
  const readNFTNonce = useReadContract({
    address: NFTMarketAddress as `0x${string}`,
    abi: NFTMarketABI,
    functionName: "getPermitNonce",
    args: [whiteAddress as `0x${string}`],
    query: { enabled: false },
  });
  const readNFTPrice = useReadContract({
    address: NFTMarketAddress as `0x${string}`,
    abi: NFTMarketABI,
    functionName: "getNFTPrice",
    args: [tokenId ? BigInt(tokenId) : BigInt(0)],
    query: { enabled: false },
  });

  const { signMessage } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();

  // EIP-712 域和类型，name 和 version 是Token代币的信息
  const domain = {
    name: tokenName ?? "",
    version: "1",
    chainId: sepolia.id,
    verifyingContract: (tokenAddress as `0x${string}`) ?? "",
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

  // NFT Market给白名单用户授权
  const domain1 = {
    name: "hoshino",
    version: "1",
    chainId: sepolia.id,
    verifyingContract: (NFTMarketAddress as `0x${string}`) ?? "",
  } as const;

  const types1 = {
    Permit: [
      { name: "buyer", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  // const valid = useVerifyTypedData({
  //   domain: domain1,
  //   types: types1,
  //   primaryType: "Permit",
  //   message: {
  //     buyer: "0x3247E8155615aC69EdC794bb351e9f88cF3568C5",
  //     tokenId: 1,
  //     value: 10,
  //     nonce: 0,
  //     deadline: BigInt(deadline),
  //   },
  //   address: "0x7df01af4c8f6D985970625f0264b5F932a24c6A4",
  //   signature: "0x7dfd44e16b59e7ed407282913ea9e1a68a4dbbdc693bcea4c5afa47fa79c9a9c4ba3bd398695270038fdc676431e98cd05600460f28306d10124b00edac2ed241c",
  // });
  // console.log("验证签名结果:", valid);

  const onReadToken = useCallback(async () => {
    try {
      const data = await readToken.refetch();
      setTokenBalance(data.data ? data.data.toString() : null);
    } catch (error) {
      console.error("读取余额失败:", error);
    }
  }, [readToken]);

  const onReadNFTPrice = useCallback(async () => {
    try {
      const data = await readNFTPrice.refetch();
      setListPrice(data.data ? data.data.toString() : null);
    } catch (error) {
      console.error("读取NFT价格失败:", error);
    }
  }, [readNFTPrice]);

  const onReadNFTOwner = useCallback(async () => {
    try {
      const data = await readNFTOwner.refetch();
      setTokenOwner(data.data ? data.data.toString() : null);
    } catch (error) {
      console.error("读取NFT所有者失败:", error);
    }
  }, [readNFTOwner]);

  // 上架并给NFT Market授权，调用NFT Market合约的list函数，并调用NFT合约的approve函数
  const onList = async () => {
    if (!isConnected || !address) {
      console.error("用户未连接钱包或没有选中地址");
      return;
    }
    if (!tokenId || isNaN(Number(tokenId)) || Number(tokenId) <= 0) {
      console.error("无效的NFT ID");
      return;
    }
    try {
      writeContract({
        address: NFTMarketAddress as `0x${string}`,
        abi: NFTMarketABI,
        functionName: "list",
        args: [BigInt(tokenId), BigInt(amount ?? -1)],
      });
      writeContract({
        address: NFTAddress as `0x${string}`,
        abi: NFTABI,
        functionName: "approve",
        args: [NFTMarketAddress as `0x${string}`, BigInt(tokenId)],
      });
      console.log("NFT已上架！");
    } catch (error) {
      console.error("NFT上架失败:", error);
    }
  };

  // 用NFT Market合约部署的地址授权白名单地址
  const onSigned = async () => {
    if (!isConnected || !address) {
      console.error("用户未连接钱包或没有选中地址");
      return;
    }
    if (!tokenId || isNaN(Number(tokenId)) || Number(tokenId) <= 0) {
      console.error("无效的NFT ID");
      return;
    }
    try {
      const nonce = BigInt((await readNFTNonce.refetch()).data ?? 0);
      const NFTPrice = await readNFTPrice
        .refetch()
        .then((data) => BigInt(data.data ?? 0));
      console.log("deadline:", deadline);
      console.log("nonce:", nonce);
      const signature = await signTypedDataAsync({
        domain: domain1,
        types: types1,
        primaryType: "Permit",
        message: {
          buyer: whiteAddress as `0x${string}`,
          tokenId: BigInt(tokenId ?? 0),
          value: NFTPrice,
          nonce: nonce,
          deadline: BigInt(deadline),
        },
      });
      console.log("签名message:", {
        domain: domain1,
        types: types1,
        primaryType: "Permit",
        message: {
          buyer: whiteAddress as `0x${string}`,
          tokenId: BigInt(tokenId ?? 0),
          value: NFTPrice,
          nonce: nonce,
          deadline: BigInt(deadline),
        },
      });
      console.log("签名信息:", signature);
      const { v, r, s } = parseSignature(signature);
      console.log("v:", v);
      console.log("r:", r);
      console.log("s:", s);
      setV1(Number(v));
      setR1(r);
      setS1(s);
    } catch (error) {
      console.error("发送交易失败:", error);
    }
  };

  const onSend = async () => {
    if (!isConnected || !address) {
      console.error("用户未连接钱包或没有选中地址");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error("无效的金额");
      return;
    }

    try {
      console.log("正在发送交易...");

      const nonce = BigInt((await readNFTNonce.refetch()).data ?? 0);
      const tokenNonce = BigInt((await readNonce.refetch()).data ?? 0);

      // 签名消息
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: "Permit",
        message: {
          owner: address as `0x${string}`,
          spender: NFTMarketAddress as `0x${string}`,
          value: BigInt(amount),
          nonce: tokenNonce,
          deadline: BigInt(deadline),
        },
      });
      console.log("签名信息:", signature);
      console.log("token签名", {
        domain,
        types,
        primaryType: "Permit",
        message: {
          owner: address as `0x${string}`,
          spender: NFTMarketAddress as `0x${string}`,
          value: BigInt(amount),
          nonce: tokenNonce,
          deadline: BigInt(deadline),
        },
      });


      // 分割签名
      const { v, r, s } = parseSignature(signature);

      writeContract({
        address: NFTMarketAddress as `0x${string}`,
        abi: NFTMarketABI,
        functionName: "permitBuy",
        args: [
          {
            buyer: address as `0x${string}`,
            tokenId: BigInt(tokenId ?? 0),
            amount: amount ? BigInt(amount) : BigInt(0),
            deadline: BigInt(deadline),
            nonce: nonce,
          },
          {
            owner: address as `0x${string}`,
            spender: NFTMarketAddress as `0x${string}`,
            amount: amount ? BigInt(amount) : BigInt(0),
            deadline: BigInt(deadline),
            nonce: tokenNonce,
          },
          [
            {
              v: v1 ?? 0,
              r: r1 as `0x${string}`,
              s: s1 as `0x${string}`,
            },
            {
              v: Number(v),
              r: r,
              s: s,
            },
          ],
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
      <h1>NFT Market</h1>
      <p>Welcome to NFT Market!</p>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
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
          <h2 style={{ marginTop: "10px" }}>NFT Address: {NFTAddress}</h2>
          <h2 style={{ marginTop: "10px" }}>
            NFT Market Address: {NFTMarketAddress}
          </h2>
          <div>
            <h2>获取NFT所有者：{tokenOwner}</h2>
            <input
              type="text"
              placeholder="Token Id"
              value={tokenId ?? ""}
              onChange={(e) => setTokenId(e.target.value)}
              style={{ marginTop: "10px", color: "black" }}
            />
            <br />
            <button
              onClick={onReadNFTOwner}
              style={{ background: "blue", marginTop: "10px" }}
            >
              获取NFT所有者
            </button>
          </div>
          <div>
            <h2>获取NFT价格：{listPrice}</h2>
            <input
              type="text"
              placeholder="Token Id"
              value={tokenId ?? ""}
              onChange={(e) => setTokenId(e.target.value)}
              style={{ marginTop: "10px", color: "black" }}
            />
            <br />
            <button
              onClick={onReadNFTPrice}
              style={{ background: "blue", marginTop: "10px" }}
            >
              获取NFT价格
            </button>
          </div>
          <div>
            <h2>第一步：使用NFT拥有者地址上架NFT {balance}</h2>
            <input
              type="text"
              placeholder="Token Id"
              value={tokenId ?? ""}
              onChange={(e) => setTokenId(e.target.value)}
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
              onClick={onList}
              style={{ background: "blue", marginTop: "10px" }}
            >
              上架NFT
            </button>
          </div>
          <div>
            <h2>第二步：使用NFT Market合约部署的地址签名一个白名单地址</h2>
            <input
              type="text"
              placeholder="White Address"
              value={whiteAddress ?? ""}
              onChange={(e) => setWhiteAddress(e.target.value)}
              style={{ marginTop: "10px", color: "black" }}
            />
            <br />
            <button
              onClick={onSigned}
              style={{ background: "blue", marginTop: "10px" }}
              disabled={isPending}
            >
              {isPending ? "正在发送..." : "签名白名单地址"}
            </button>
            <div>
              <h2>第三步：使用白名单地址购买NFT</h2>
              <button
                onClick={onSend}
                style={{ background: "blue", marginTop: "10px" }}
                disabled={isPending}
              >
                {isPending ? "正在发送..." : "购买NFT"}
              </button>
              <div>
                {isPending && <p>交易正在处理中...</p>}
                {hash && <p>交易 Hash: {hash}</p>}
                {error && <p style={{ color: "red" }}>错误: {error.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
