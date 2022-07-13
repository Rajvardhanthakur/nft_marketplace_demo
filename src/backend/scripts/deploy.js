const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Delopying contracts with the account : ", deployer.address);
    console.log("Account balance : ", (await deployer.getBalance()).toString());

    // Get the ContractFactories and Signers here.
    const NFT = await ethers.getContractFactory("NFT");

    //deploy contract
    const nft = await NFT.deploy();
}

main().then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })