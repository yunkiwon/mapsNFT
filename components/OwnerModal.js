import React, { useRef, useEffect, useState } from 'react';
import { UserProvider } from '../utils/userProvider';

export default function OwnerModal() {

    const [nfts, setNFTs] = useState([])
    const [selectedNFT, setSelectedNFT] = useState('')

    useEffect(() => {
        UserProvider.getOpenseaItems("0xc8D9651bEAc1d74634800F3E2Ed3701325047fEc").then((nfts) => {
          setNFTs(nfts);
        });
      }
    , []);

  return (
    <div className="width-1/2 ">
    <div>Add or modify your block image</div>
    {
        nfts ? nfts.map((item,i) => 
        <div className={`my-2 mx-2 flex-shrink-0 rounded-full w-32 h-32 ${selectedNFT == item.metadata.image ? 'outline outline-3' : null}`} 
              key={i}
              onClick={(e) => setSelectedNFT(item.metadata.image)}>
                <div className="flex justify-center items-center imageContainer">
                  <img
                    style={{ cursor: 'pointer' }}
                    className="w-32 h-32 rounded-full drop-shadow-lg foregroundImg object-cover"
                    src={ item.metadata.image }
                  />
             
                </div>
        </div>
        )
        :
          <p>No NFTs Available</p>
        
      }
      </div>
  )

}
