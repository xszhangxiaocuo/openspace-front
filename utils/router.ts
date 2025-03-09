import { apiFetch } from "./api";

export const getListSig = async () => {
  return apiFetch("/project/getListSig");
};

export interface AddSigRequest {
  seller: string;
  tokenId: string;
  price: string;
  deadline: string;
  signature: string;
}

export const addSig = async (sigData: AddSigRequest) => {
  return apiFetch("/project/addSig", {
    method: "POST",
    body: sigData,
  });
};

export const getSig = async (tokenId: string) => {
  return apiFetch(`/project/getSig/${tokenId}`);
};