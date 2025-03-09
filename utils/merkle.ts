import { toHex, encodePacked, keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

const users = [
  { address: "0x93BDBe2c9f0F5cec59175C51D0a39fAee42A4a6e" },
  { address: "0xb7D15753D3F76e7C892B63db6b4729f700C01298" },
  { address: "0xf69Ca530Cd4849e3d1329FBEC06787a96a3f9A68" },
  { address: "0xa8532aAa27E9f7c3a96d754674c99F1E2f824800" },
];

// equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, amount));
const elements = users.map((x) =>
  keccak256(encodePacked(["address"], [x.address as `0x${string}`]))
);

// console.log(elements)

const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

const root = merkleTree.getHexRoot();
console.log("root:" + root);

const leaf = elements[0];
const proof = merkleTree.getHexProof(leaf);
console.log("proof:" + proof);

// 0xa8532aAa27E9f7c3a96d754674c99F1E2f824800, 30, [0xd24d002c88a75771fc4516ed00b4f3decb98511eb1f7b968898c2f454e34ba23,0x4e48d103859ea17962bdf670d374debec88b8d5f0c1b6933daa9eee9c7f4365b]
