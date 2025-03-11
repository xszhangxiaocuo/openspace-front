"use client";

import { useEffect, useState } from "react";
import { getListSig } from "@/utils/router";

export interface ListSig {
  id: number;
  seller: string;
  tokenId: string;
  price: string;
  deadline: string;
  signature: string;
}

export default function SigList() {
  const [listSig, setListSig] = useState<ListSig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchListSig() {
    try {
      setLoading(true);
      // 查询所有离线签名
      getListSig().then((res) => {
        console.log(res);
        setListSig((res as { data: ListSig[] }).data);
      });
    } catch (error) {
      console.error("查询离线签名出错:", error);
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
      <h1 className="text-xl font-bold mb-4">上架离线签名列表</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchListSig}
      >
        查询
      </button>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : listSig.length === 0 ? (
        <p className="text-gray-500">未找到上架离线签名。</p>
      ) : (
        <table
          className="w-full border-collapse border border-gray-300"
          style={{ marginTop: "20px" }}
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">id</th>
              <th className="border border-gray-300 px-4 py-2">seller</th>
              <th className="border border-gray-300 px-4 py-2">tokenId</th>
              <th className="border border-gray-300 px-4 py-2">price</th>
              <th className="border border-gray-300 px-4 py-2">deadline</th>
              <th className="border border-gray-300 px-4 py-2">signature</th>
            </tr>
          </thead>
          <tbody>
            {listSig.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {tx.id}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {tx.seller}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {tx.tokenId}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {tx.price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {tx.deadline}
                </td>
                <td className="border border-gray-300 px-4 py-2" style={{ wordBreak: "break-all" }}>
                  {tx.signature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
