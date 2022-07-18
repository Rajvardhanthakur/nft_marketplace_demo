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
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!!");
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setConnectedAccount(accounts[0])
    } catch (error) {
      throw new Error(`Error while connecting wallet ---${error}`)
    }
  }

  const loadMarketplaceItems = async () => {
    const { marketplace, nft } = await getEthereumContract();

    const itemCount = await marketplace.itemCount();
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        //get url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri)
        const metadata = await response.json();
        // get total price of item 
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add items to item array
        item.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.description,
          image: metadata.image
        })
      }
    }

    setMarketplaceItems(items)
  }

  const buyMarketItem = async (item) => {
    const { marketplace, nft } = await getEthereumContract();

    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait();
    loadMarketplaceItems();
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    loadMarketplaceItems();
  }, [])

  return (
    <>
      <TransactionContext.Provider value={{ connectedAccount, isLoading, connectWallet, marketplaceItems, buyMarketItem }}>
        {children}
      </TransactionContext.Provider>
    </>
  )
}