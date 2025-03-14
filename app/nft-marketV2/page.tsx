"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import {
  useReadContract,
  useWriteContract,
  useSignMessage,
  useSignTypedData,
  useVerifyTypedData,
} from "wagmi";
import { sepolia } from "viem/chains";
import { useState, useEffect, useCallback } from "react";
import { NFTABI, NFTMarketABI, ERC20ABI } from "./abi";
import { parseSignature } from "viem";
import { AddSigRequest, addSig, getSig } from "@/utils/router";
import { ListSig } from "./sigList/page";

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
    "0xBDD14a569066db595B17f02B895388a7de36d219"
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
  // 固定时间戳
  const [deadline, setDeadline] = useState<number>(
    () => Math.floor(Date.now() / 1000) + 24 * 60 * 60
  );

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

  // NFT Market给白名单用户授权
  const types1 = {
    Permit: [
      { name: "buyer", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  // NFT拥有者上架签名
  const types2 = {
    ListPermit: [
      { name: "seller", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
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

  // 上架NFT，使用离线签名
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
      const signature = await signTypedDataAsync({
        domain: domain1,
        types: types2,
        primaryType: "ListPermit",
        message: {
          seller: address as `0x${string}`,
          tokenId: BigInt(tokenId ?? 0),
          price: BigInt(amount),
          deadline: BigInt(deadline),
        },
      });
      // 签名完成后添加到数据库
      await addSig({
        seller: address as `0x${string}`,
        tokenId: tokenId,
        price: amount,
        deadline: deadline.toString(),
        signature: signature as `0x${string}`,
      });
      writeContract({
        address: NFTAddress as `0x${string}`,
        abi: NFTABI,
        functionName: "approve",
        args: [NFTMarketAddress as `0x${string}`, BigInt(tokenId)],
      });
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
      console.log("deadline:", deadline);
      console.log("nonce:", nonce);
      const signature = await signTypedDataAsync({
        domain: domain1,
        types: types1,
        primaryType: "Permit",
        message: {
          buyer: whiteAddress as `0x${string}`,
          tokenId: BigInt(tokenId ?? 0),
          value: BigInt(amount),
          nonce: nonce,
          deadline: BigInt(deadline),
        },
      });
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

  const onSend = async (isToken: boolean) => {
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

      // 分割签名
      const { v, r, s } = parseSignature(signature);
      let v3: number | undefined,
        r3: string | undefined,
        s3: string | undefined;

      getSig(tokenId ?? "").then((res) => {
        const data = (res as { data: ListSig }).data;
        if (data) {
          const parsedSig = parseSignature(data.signature as `0x${string}`);
          v3 = parsedSig.v ? Number(parsedSig.v) : undefined;
          r3 = parsedSig.r;
          s3 = parsedSig.s;
        }

        writeContract({
          address: NFTMarketAddress as `0x${string}`,
          abi: NFTMarketABI,
          functionName: "permitBuyWithOwnerSignature",
          args: [
            {
              listPermitData: {
                seller: data.seller as `0x${string}`,
                tokenId: BigInt(data.tokenId),
                price: BigInt(data.price),
                deadline: BigInt(data.deadline),
              },
              permitData: {
                buyer: address as `0x${string}`,
                tokenId: BigInt(tokenId ?? 0),
                amount: amount ? BigInt(amount) : BigInt(0),
                nonce: nonce,
                deadline: BigInt(deadline),
              },
              tokenPermitData: {
                owner: address as `0x${string}`,
                spender: NFTMarketAddress as `0x${string}`,
                amount: amount ? BigInt(amount) : BigInt(0),
                deadline: BigInt(deadline),
                nonce: tokenNonce,
              },
              signature: [
                {
                  v: v3 ?? 0,
                  r: (r3 ?? "") as `0x${string}`,
                  s: (s3 ?? "") as `0x${string}`,
                },
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
            },
            isToken,
          ],
        });

        console.log("交易已发送！");
      });
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
                onClick={() => onSend(true)}
                style={{ background: "blue", marginTop: "10px" }}
                disabled={isPending}
              >
                {isPending ? "正在发送..." : "使用token购买NFT"}
              </button>
              <div>
                {isPending && <p>交易正在处理中...</p>}
                {hash && <p>交易 Hash: {hash}</p>}
                {error && <p style={{ color: "red" }}>错误: {error.message}</p>}
              </div>
            </div>
            <div>
              <a
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                href="/nft-marketV2/sigList"
                target="_blank"
                rel="noopener noreferrer"
              >
                查询所有离线签名
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
