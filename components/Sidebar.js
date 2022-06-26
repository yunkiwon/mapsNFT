import React, { useRef, useEffect, useState } from 'react';
import { UserProvider } from '../utils/userProvider';
import OwnerModal from './OwnerModal'
import WelcomeModal from './WelcomeModal'

export default function Sidebar({address}) {

    const [nfts, setNFTs] = useState([])
    const [selectedNFT, setSelectedNFT] = useState('')
    const [ownsBlockParty, setOwnsBlockParty] = useState(true) 

    useEffect(() => {
        if(address !== null){
            console.log(address)
            UserProvider.getOpenseaItems(address).then((nfts) => {
              setNFTs(nfts);
            });
        }
      }
    , [address]);

  return (
    <div className="w-1/2">
    {
        ownsBlockParty ? 
        <OwnerModal/> :
        <WelcomeModal/>
    }
    </div> 
  )

}
