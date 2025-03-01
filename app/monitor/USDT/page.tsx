"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const transferEventAbi = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

interface Transfer {
  from: string;
  to: string;
  amount: string;
  blockNumber: bigint;
  transactionHash: string;
}

export default function USDTTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    const unwatch = client.watchEvent({
      address: USDT_ADDRESS,
      event: transferEventAbi,
      onLogs: (logs) => {
        const parsedTransfers = logs.reverse().map((log) => ({
          from: log.args.from || "",
          to: log.args.to || "",
          amount: (Number(log.args.value) / 1e6).toFixed(5), // USDT 有 6 位小数
          transactionHash: log.transactionHash,
          blockNumber: BigInt(log.blockNumber),
        }));
        setTransfers((prevTransfers) => [...parsedTransfers, ...prevTransfers]);
      },
    });
  }, []);

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
        监控 USDT 转账记录
      </h1>
        <table
          className="w-full border-collapse border border-gray-300"
          style={{ marginTop: "20px" }}
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">From</th>
              <th className="border border-gray-300 px-4 py-2">To</th>
              <th className="border border-gray-300 px-4 py-2">
                Amount (USDT)
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
    </div>
  );
}
