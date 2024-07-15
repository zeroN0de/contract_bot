import { ethers } from "ethers";
import fs from "fs";

const fileName = "wallets.json";

function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  console.log("지갑 주소:", wallet.address);
  console.log("개인 키:", wallet.privateKey);
  console.log("지갑의 공개 키:", wallet.publicKey);
  console.log("mnemonic (니모닉):", wallet.mnemonic);

  // 새로운 지갑 데이터 생성
  const newWalletData = {
    number: 1, // 초기값
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    mnemonic: wallet.mnemonic.phrase,
  };

  // 파일이 이미 존재하면 기존 데이터를 읽고 새 데이터를 추가
  if (fs.existsSync(fileName)) {
    const data = fs.readFileSync(fileName);
    const wallets = JSON.parse(data);

    newWalletData.number = wallets.length + 1; // 지갑 번호 자동 증가
    wallets.push(newWalletData);
    fs.writeFileSync(fileName, JSON.stringify(wallets, null, 2));
  } else {
    // 파일이 존재하지 않으면 새 파일 생성
    fs.writeFileSync(fileName, JSON.stringify([newWalletData], null, 2));
  }

  console.log(`${fileName} 파일에 지갑 정보가 저장되었습니다.`);
}

createWallet();
