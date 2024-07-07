import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

import dotenv from "dotenv";
dotenv.config();

import abi from "./abi.json" assert { type: "json" };

const url =
  "https://base-sepolia.g.alchemy.com/v2/mJQmSvUYhfb8mZhGsg_WRyF9nWVURjNK";
const provider = new ethers.JsonRpcProvider(url);
const wndsCA = "0xFc729c99c5e593b3747Fb83c9090c2F4B0398Df6";
const wndsAddress = "0xF6EB0d21e5B381578abfc101A5b231f5c8bdf18B";
// console.log(process.env.PRIV_KEY, "priv_key");
const signer = new ethers.Wallet(process.env.PRIV_KEY, provider);
let timestamp = Date.now() + 100;
console.log(timestamp);

async function depositWithEther() {
  try {
    const tx = await contract.deposit.send({
      value: amountToSend,
    });
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getNumber() {
  // let blockNumber = await provider.getBlockNumber();
  // console.log(blockNumber);
  const contractAddress = "0xFDeaa3902FCe20D988ba5eBBDA96eEf4C31963Aa"; // 여기에 컨트랙트 주소 입력
  const contarctAbi = abi.abi; // 컨트랙트 ABI 입력
  // console.log(contarctAbi);
  const contract = new ethers.Contract(contractAddress, contarctAbi, signer);
  let amountIn = 100000000000;
  let fees = 1000000000;
  let values = amountIn + fees;
  //   let ethValues = ethers.utils.BigInt(values.toString());
  //   console.log(contract);
  try {
    const result = await contract.buy(
      amountIn,
      fees,
      wndsCA,
      wndsAddress,
      timestamp,
      {
        value: values,
      }
    );

    console.log("Result:", result);
  } catch (error) {
    console.error("에러가 뭐냐? \n", error);
  }
}
getNumber();
