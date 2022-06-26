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

  // fetch(`${process.env.NFTPORT_BACKEND_URL}${process.env.BLOCKPARTY_CONTRACT_ADDRESS}?chain=ethereum&include=metadata`, {
  //   method: 'GET',
  //   headers: {"Content-Type": 'application/json', Authorization: process.env.NFTPORT_KEY}
  // }).then(res => res.json()).then(d => console.log(d))



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
