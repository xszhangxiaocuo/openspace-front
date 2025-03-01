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

interface Block {
  blockNumber: bigint;
  blockHash: string;
}

export default function NewBlock() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  useEffect(() => {
    const unwatch = client.watchBlocks({
      onBlock: (block: any) => {
        if (blocks[0]?.blockNumber === BigInt(block.number)) {
          return;
        }
        const newBlock: Block = {
          blockNumber: BigInt(block.number),
          blockHash: block.hash,
        };
        setBlocks((prevBlocks) => [newBlock, ...prevBlocks]);
      },
    });

    return () => {
      unwatch();
    };
  }, [blocks, client]);

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
        最新区块监控
      </h1>
      <table
        className="w-full border-collapse border border-gray-300"
        style={{ marginTop: "20px" }}
      >
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">BlockNumber</th>
            <th className="border border-gray-300 px-4 py-2">
              BlockHash
            </th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((tx, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-right">
                {tx.blockNumber}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {tx.blockHash}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
