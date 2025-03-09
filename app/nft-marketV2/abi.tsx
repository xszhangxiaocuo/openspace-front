export const NFTABI = [
  {
    type: "function",
    name: "ownerOf",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const NFTMarketABI = [
  {
      "type": "constructor",
      "inputs": [
          {
              "name": "_tokenAddress",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "_nftAddress",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "nonpayable"
  },
  {
      "type": "fallback",
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "DOMAIN_SEPARATOR",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "DOMAIN_TYPEHASH",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "LIST_PERMIT_TYPEHASH",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "PERMIT_TYPEHASH",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "_owner",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "buyNFT",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "cancelOrder",
      "inputs": [
          {
              "name": "listPermitData",
              "type": "tuple",
              "internalType": "struct NFTMarket.ListPermitData",
              "components": [
                  {
                      "name": "seller",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "price",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "deadline",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "name": "sig",
              "type": "tuple",
              "internalType": "struct NFTMarket.Signature",
              "components": [
                  {
                      "name": "v",
                      "type": "uint8",
                      "internalType": "uint8"
                  },
                  {
                      "name": "r",
                      "type": "bytes32",
                      "internalType": "bytes32"
                  },
                  {
                      "name": "s",
                      "type": "bytes32",
                      "internalType": "bytes32"
                  }
              ]
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "cancelOrders",
      "inputs": [
          {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "getNFTOwner",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "getNFTPrice",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "getNonce",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "getPermitNonce",
      "inputs": [
          {
              "name": "owner",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "list",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "price",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "nft",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "contract MyERC721"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "nftOwners",
      "inputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "nftPrices",
      "inputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "nonces",
      "inputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "permitBuy",
      "inputs": [
          {
              "name": "permitData",
              "type": "tuple",
              "internalType": "struct NFTMarket.PermitData",
              "components": [
                  {
                      "name": "buyer",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "tokenId",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "amount",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "nonce",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "deadline",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "name": "tokenPermitData",
              "type": "tuple",
              "internalType": "struct NFTMarket.TokenPermitData",
              "components": [
                  {
                      "name": "owner",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "spender",
                      "type": "address",
                      "internalType": "address"
                  },
                  {
                      "name": "amount",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "nonce",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
                  {
                      "name": "deadline",
                      "type": "uint256",
                      "internalType": "uint256"
                  }
              ]
          },
          {
              "name": "signature",
              "type": "tuple[]",
              "internalType": "struct NFTMarket.Signature[]",
              "components": [
                  {
                      "name": "v",
                      "type": "uint8",
                      "internalType": "uint8"
                  },
                  {
                      "name": "r",
                      "type": "bytes32",
                      "internalType": "bytes32"
                  },
                  {
                      "name": "s",
                      "type": "bytes32",
                      "internalType": "bytes32"
                  }
              ]
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "permitBuyWithOwnerSignature",
      "inputs": [
          {
              "name": "params",
              "type": "tuple",
              "internalType": "struct NFTMarket.PermitBuyWithOwnerSignatureParams",
              "components": [
                  {
                      "name": "permitData",
                      "type": "tuple",
                      "internalType": "struct NFTMarket.PermitData",
                      "components": [
                          {
                              "name": "buyer",
                              "type": "address",
                              "internalType": "address"
                          },
                          {
                              "name": "tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "nonce",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "deadline",
                              "type": "uint256",
                              "internalType": "uint256"
                          }
                      ]
                  },
                  {
                      "name": "tokenPermitData",
                      "type": "tuple",
                      "internalType": "struct NFTMarket.TokenPermitData",
                      "components": [
                          {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                          },
                          {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                          },
                          {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "nonce",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "deadline",
                              "type": "uint256",
                              "internalType": "uint256"
                          }
                      ]
                  },
                  {
                      "name": "listPermitData",
                      "type": "tuple",
                      "internalType": "struct NFTMarket.ListPermitData",
                      "components": [
                          {
                              "name": "seller",
                              "type": "address",
                              "internalType": "address"
                          },
                          {
                              "name": "tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "price",
                              "type": "uint256",
                              "internalType": "uint256"
                          },
                          {
                              "name": "deadline",
                              "type": "uint256",
                              "internalType": "uint256"
                          }
                      ]
                  },
                  {
                      "name": "signature",
                      "type": "tuple[]",
                      "internalType": "struct NFTMarket.Signature[]",
                      "components": [
                          {
                              "name": "v",
                              "type": "uint8",
                              "internalType": "uint8"
                          },
                          {
                              "name": "r",
                              "type": "bytes32",
                              "internalType": "bytes32"
                          },
                          {
                              "name": "s",
                              "type": "bytes32",
                              "internalType": "bytes32"
                          }
                      ]
                  }
              ]
          },
          {
              "name": "useToken",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "outputs": [],
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "token",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "tokensReceived",
      "inputs": [
          {
              "name": "_addr",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "_amount",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "_data",
              "type": "bytes",
              "internalType": "bytes"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "nonpayable"
  },
  {
      "type": "event",
      "name": "NFTListed",
      "inputs": [
          {
              "name": "seller",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "nftId",
              "type": "uint256",
              "indexed": true,
              "internalType": "uint256"
          },
          {
              "name": "price",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "NFTSold",
      "inputs": [
          {
              "name": "buyer",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "nftId",
              "type": "uint256",
              "indexed": true,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "OrderCanceled",
      "inputs": [
          {
              "name": "seller",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "nftId",
              "type": "uint256",
              "indexed": true,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
          {
              "name": "token",
              "type": "address",
              "internalType": "address"
          }
      ]
  }
] as const;

export const ERC20ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    type: "function",
    name: "nonces",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "permit",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "v",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "r",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
