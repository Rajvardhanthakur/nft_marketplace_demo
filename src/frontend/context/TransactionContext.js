import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { marketplaceABI, marketplaceAddress, nftABI, nftAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const initialState = "";

const getEthereumContract = () => {
  //Get Provider from metamask
  const provider = new ethers.providers.Web3Provider(ethereum);
  //Get signer 
  const signer = provider.getSigner();

  //Get deployed copies of contract
  const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);
  const nft = new ethers.Contract(nftAddress, nftABI, signer);

  return ({
    marketplace,
    nft
  })

}

export const TransactionProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState(initialState);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask and do appropiate setup!!")

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts, '--------accounts')
      if (accounts.length) {
        setConnectedAccount(accounts[0]);
      } else {
        console.log("no account found")
      }
    } catch (error) {
      throw new Error("Error on checkIfWalletConnected----", error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <>
      <TransactionContext.Provider value={{ value: "hello" }}>
        {children}
      </TransactionContext.Provider>
    </>
  )
}