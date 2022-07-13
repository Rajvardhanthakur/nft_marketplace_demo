const { ethers, artifacts } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Delopying contracts with the account : ", deployer.address);
  console.log("Account balance : ", (await deployer.getBalance()).toString());

  // Get the ContractFactories and Signers here.
  const NFT = await ethers.getContractFactory("NFT");

  //deploy contract
  const nft = await NFT.deploy();
  saveToFronted(nft, "NFT");
}

const saveToFronted = (contract, name) => {
  const fs = require("fs");

  const contractDir = __dirname + "/../../frontend/contractData";

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  fs.writeFileSync(
    contractDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  )

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  )
}

main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })