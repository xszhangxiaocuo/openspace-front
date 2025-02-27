"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48";
const transferEventAbi = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

interface Transfer {
  from: string;
  to: string;
  amount: string;
  blockNumber: number;
  transactionHash: string;
}

export default function USDCTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchTransfers() {
    try {
      setLoading(true);
      const latestBlock = await client.getBlockNumber();
      const startBlock = latestBlock - 100n;

      const logs = await client.getLogs({
        address: USDC_ADDRESS,
        event: transferEventAbi,
        fromBlock: startBlock,
        toBlock: latestBlock,
      });

      const parsedTransfers = logs.reverse().map((log) => ({
        from: log.args.from,
        to: log.args.to,
        amount: (Number(log.args.value) / 1e6).toFixed(5), // USDC 有 6 位小数
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));

      setTransfers(parsedTransfers as unknown as Transfer[]);
    } catch (error) {
      console.error("查询 USDC 转账记录出错:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="max-w-4xl mx-auto p-6"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        alignItems: "center",
      }}
    >
      <h1 className="text-xl font-bold mb-4">
        最近 100 个区块的 USDC 转账记录
      </h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchTransfers}
      >
        查询
      </button>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : transfers.length === 0 ? (
        <p className="text-gray-500">未找到 USDC 转账记录。</p>
      ) : (
        <table
          className="w-full border-collapse border border-gray-300"
          style={{ marginTop: "20px" }}
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">From</th>
              <th className="border border-gray-300 px-4 py-2">To</th>
              <th className="border border-gray-300 px-4 py-2">
                Amount (USDC)
              </th>
              <th className="border border-gray-300 px-4 py-2">BlockNumber</th>
              <th className="border border-gray-300 px-4 py-2">
                Transaction({transfers.length})
              </th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {tx.from}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {tx.to}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {tx.amount}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {tx.blockNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={`https://etherscan.io/tx/${tx.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    查看交易
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
