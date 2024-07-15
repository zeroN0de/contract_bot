import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

import abi from "./abi.json" assert { type: "json" };

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

export async function buying(wallets) {
  const contractAddress = "0xFDeaa3902FCe20D988ba5eBBDA96eEf4C31963Aa";
  const contractAbi = abi.abi;
  const tokenAddress = "0xFc729c99c5e593b3747Fb83c9090c2F4B0398Df6";

  // Prepare promises array for all transactions
  const promises = wallets.map((walletData) => {
    const wallet = new ethers.Wallet(walletData.privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    let timestamp = Date.now() + 100;
    let amountIn = 1000000000; // Adjust according to your need
    let fees = 10000000; // Adjust according to your need
    let values = amountIn + fees;

    return contract
      .buy(amountIn, fees, tokenAddress, walletData.address, timestamp, {
        value: values,
      })
      .then((result) => {
        console.log(
          `Transaction successful for wallet ${walletData.address}: ${result.hash}`
        );
        return result;
      })
      .catch((error) => {
        console.error(`Error with wallet ${walletData.address}:`, error);
        return error; // Returning error to handle it later if necessary
      });
  });

  // Execute all promises at once
  const results = await Promise.allSettled(promises);
  console.log("All transactions have been processed.");
  console.log(results);
  return results;
}
