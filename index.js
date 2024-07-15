import fs from "fs";
import readline from "readline";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const fundingWallet = new ethers.Wallet(process.env.PRIV_KEY, provider);
const fileName = "wallets.json";
const minimumBalance = ethers.utils.parseEther("0.1");
const gasLimit = ethers.BigNumber.from(21000); // 이더 전송 가스 한도
const gasPrice = ethers.utils.parseUnits("10", "gwei"); // 가스 가격
const totalCost = minimumBalance.add(gasLimit.mul(gasPrice));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loadWallets() {
  if (!fs.existsSync(fileName)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(fileName, "utf8"));
}

async function fundWallet(walletAddress) {
  const walletBalance = await provider.getBalance(walletAddress);
  if (walletBalance.lt(minimumBalance)) {
    try {
      const tx = await fundingWallet.sendTransaction({
        to: walletAddress,
        value: minimumBalance,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      });
      await tx.wait();
      console.log(`Funded wallet ${walletAddress} with minimum balance.`);
    } catch (error) {
      console.error(`Failed to fund wallet ${walletAddress}:`, error);
    }
  }
}

async function createAdditionalWallets(wallets, count) {
  const balance = await provider.getBalance(fundingWallet.address);
  if (balance.lt(totalCost.mul(count))) {
    console.log("Insufficient funds in the funding wallet to proceed.");
    return wallets; // 추가 지갑 없이 기존 지갑 반환
  }

  for (let i = 0; i < count; i++) {
    const newWallet = ethers.Wallet.createRandom();
    wallets.push({
      number: wallets.length + 1,
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      publicKey: newWallet.publicKey,
      mnemonic: newWallet.mnemonic.phrase,
    });
    await fundWallet(newWallet.address);
  }
  fs.writeFileSync(fileName, JSON.stringify(wallets, null, 2));
  return wallets;
}

async function checkAndPrepareWallets(neededWallets) {
  let wallets = loadWallets();
  if (wallets.length < neededWallets) {
    wallets = await createAdditionalWallets(
      wallets,
      neededWallets - wallets.length
    );
  }

  // Existing wallets funding
  for (const wallet of wallets) {
    await fundWallet(wallet.address);
  }

  return wallets.slice(0, neededWallets);
}

rl.question("How many wallets do you need to test with? ", async (input) => {
  const neededWallets = parseInt(input);
  if (isNaN(neededWallets) || neededWallets <= 0) {
    console.log("Please enter a valid number.");
    rl.close();
    return;
  }
  const wallets = await checkAndPrepareWallets(neededWallets);
  rl.close();
  // Buying function call
  const buyingModule = await import("./buying.js");
  buyingModule.buying(wallets);
});
