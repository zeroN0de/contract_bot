import { ethers } from "ethers";

// 무작위로 새 지갑 생성
function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  console.log("지갑 주소:", wallet.address);
  console.log("개인 키:", wallet.privateKey);
  console.log("지갑의 공개 키:", wallet.publicKey);
  console.log("mnemonic (니모닉):", wallet.mnemonic);
}

createWallet();
