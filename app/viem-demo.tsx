"use client";

import { publicClient } from "./client";
import { useEffect, useState } from "react";

function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function ViemDemo() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await publicClient.getBlockNumber();
        setData(result);
      } catch (error) {
        console.error("获取区块号失败: ", error);
        setData("获取失败");
      }
    }
    fetchData();

    const intervalId = setInterval(fetchData, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Header title="Viem Demo" />
      <div>
        <p>Current block number: {data ? data.toString() : "加载中..."}</p>
      </div>
    </div>
  );
}
