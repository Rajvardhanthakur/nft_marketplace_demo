import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

import { marketplaceABI, marketplaceAddress, nftABI, nftAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0")

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
  const [nftObj, setNftObj] = useState({
    name: "",
    image: null,
    price: 0,
    description: ""
  })
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
    console.log(itemCount, '------------itemCount')
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const item = await marketplace.items(i);
      console.log(item, '--------item')
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

  const uploadToNft = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result, '-----------result');
        setNftObj({
          ...nftObj,
          image: `https:/ipfs.infura.io/ipfs/${result.path}`
        })
      } catch (error) {
        throw new Error(`uploadToNft-------${error}`)
      }
    }
  }

  const createNft = async () => {
    try {
      const result = await client.add(JSON.stringify({ image: nftObj.image, name: nftObj.name, description: nftObj.description }))
      mintNFT(result);
    } catch (error) {
      throw new Error(`createNft-------------${error}`)
    }
  }

  const mintNFT = async (result) => {

    const { nft, marketplace } = await getEthereumContract();

    const uri = `https//ipfs.infura.io/ipfs/${result.path}`;

    //mint nft
    await (await nft.mint(uri)).wait();
    //get tokenId of new  nft
    const id = await nft.tokenCount();
    //approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();

    //add nft to marketplace
    const listingPrice = ethers.utils.parseEther(nftObj.price.toString())
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  }

  const handleNftObj = (e) => {
    const { name, value } = e.target;
    setNftObj({
      ...nftObj,
      [name]: value
    })
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    loadMarketplaceItems();
  }, [])

  return (
    <>
      <TransactionContext.Provider value={{ connectedAccount, isLoading, connectWallet, marketplaceItems, buyMarketItem, createNft, uploadToNft, handleNftObj }}>
        {children}
      </TransactionContext.Provider>
    </>
  )
}