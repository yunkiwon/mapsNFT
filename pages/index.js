import Head from 'next/head'
import { useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'
import TotalSupply from '../components/TotalSupply'
import Wallet from '../components/Wallet'
import YourNFTs from '../components/YourNFTs'

export default function Home() {
  // Constants
  const MINT_PRICE = 0.03;
  const MAX_MINT = 10;

  // UI state
  const [mintQuantity, setMintQuantity] = useState(1)
  const mintQuantityInputRef = useRef()
  const [mintError, setMintError] = useState(false)
  const [mintMessage, setMintMessage] = useState('')
  const [mintLoading, setMintLoading] = useState(false)

  // Call smart contract to mint NFT(s) from current address
  async function mintNFTs() {
    // Check quantity
    if (mintQuantity < 1) {
      setMintMessage('You need to mint at least 1 NFT.')
      setMintError(true)
      mintQuantityInputRef.current.focus()
      return
    }
    if (mintQuantity > MAX_MINT) {
      setMintMessage('You can only mint a maximum of 10 NFTs.')
      setMintError(true)
      mintQuantityInputRef.current.focus()
      return
    }

    // Get wallet details
    if (!hasEthereum()) return
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()

      try {
        const address = await signer.getAddress()

        setMintLoading(true);
        // Interact with contract
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, signer)
        const totalPrice = MINT_PRICE * mintQuantity
        const transaction = await contract.mint(mintQuantity, {value: ethers.utils.parseEther(totalPrice.toString())})
        await transaction.wait()

        mintQuantityInputRef.current.value = 0
        setMintMessage(`Congrats, you minted ${mintQuantity} token(s)!`)
        setMintError(false)
      } catch {
        setMintMessage('Connect your wallet first.');
        setMintError(true)
      }
    } catch (error) {
      setMintMessage(error.message)
      setMintError(true)
    }
    setMintLoading(false)
  }

  fetch(`${process.env.NFTPORT_BACKEND_URL}${process.env.BLOCKPARTY_CONTRACT_ADDRESS}?chain=ethereum&include=metadata`, {
    method: 'GET',
    headers: {"Content-Type": 'application/json', Authorization: process.env.NFTPORT_KEY}
  }).then(res => res.json()).then(d => console.log(d))



  return (
      <div className="max-w-xl mt-36 mx-auto px-4">
        <Head>
          <title>Neighborhood</title>
          <meta name="description" content="Mint an NFT, or a number of NFTs, from the client-side."/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        <Wallet/>
        <main className="space-y-8">

        </main>

      </div>
  )
}
