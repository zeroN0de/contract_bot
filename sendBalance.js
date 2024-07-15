import fs from "fs";
import readline from "readline";
import { ethers } from "ethers";
import dotenv from "dotenv";
import abi from "./abi.json" assert { type: "json" };
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const fundingWallet = new ethers.Wallet(process.env.PRIV_KEY, provider);
const fileName = "wallets.json";
const minimumBalance = ethers.utils.parseEther("0.001");

async function createAdditionalWallets() {
  const tx = await fundingWallet.sendTransaction({
    to: "0x296aa3adB0c6C3eb3359681480C005A2AabD697E",
    value: minimumBalance,
  });
  console.log(tx);
  await tx.wait();
}
// createAdditionalWallets();

async function buying() {
  const contractAddress = "0xFDeaa3902FCe20D988ba5eBBDA96eEf4C31963Aa";
  const contractAbi = abi.abi;
  const tokenAddress = "0xFc729c99c5e593b3747Fb83c9090c2F4B0398Df6";
  console.log(fundingWallet);
  const contract = new ethers.Contract(
    contractAddress,
    contractAbi,
    fundingWallet
  );
  let timestamp = Date.now() + 100;
  let amountIn = 1000000000;
  let fees = 10000000;
  let values = amountIn + fees;
  try {
    const result = await contract.buy(
      amountIn,
      fees,
      tokenAddress,
      "0xF6EB0d21e5B381578abfc101A5b231f5c8bdf18B",
      timestamp,
      {
        value: values,
      }
    );
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

buying();
