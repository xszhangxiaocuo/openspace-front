"use client";

import { publicClient } from "./client";
import { useEffect, useState } from "react";

const contractAddress = "0x0483b0dfc6c78062b9e999a82ffb795925381415";
const abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function ReadContract() {
    const [owner, setOwner] = useState<string | null>(null);
    const [tokenURI, setTokenURI] = useState<string | null>(null);
    const [tokenId, setTokenId] = useState<number>(1);
    const [inputTokenId, setInputTokenId] = useState<string>("1");
  
    const fetchContractData = async (tokenId: number) => {
      try {
        const ownerAddress = await publicClient.readContract({
          address: contractAddress,
          abi: abi,
          functionName: 'ownerOf',
          args: [tokenId],
        });
        setOwner(ownerAddress as string);
  
        const uri = await publicClient.readContract({
          address: contractAddress,
          abi: abi,
          functionName: 'tokenURI',
          args: [tokenId],
        });
        setTokenURI(uri as string);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };
  
    const handleQuery = () => {
      const tokenIdNumber = parseInt(inputTokenId, 10);
      if (!isNaN(tokenIdNumber)) {
        setTokenId(tokenIdNumber);
        fetchContractData(tokenIdNumber);
      } else {
        console.error("Invalid tokenId");
      }
    };
  
    useEffect(() => {
      fetchContractData(tokenId);
    }, []);
  
    return (
      <div>
        <Header title="Read Contract" />
        <div>
          <input
            type="text"
            value={inputTokenId}
            onChange={(e) => setInputTokenId(e.target.value)}
            placeholder="Enter tokenId"
          />
          <button onClick={handleQuery}>Query</button>
        </div>
        <div>
          <p>Owner of token {tokenId}: {owner ? owner : "Loading..."}</p>
          <p>Token URI: {tokenURI ? tokenURI : "Loading..."}</p>
        </div>
      </div>
    );
  }