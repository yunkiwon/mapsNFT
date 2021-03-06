import React, {useState} from 'react';
import {ethers} from "ethers";
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'

export default function OwnerModal({nfts}) {

    const [selectedNFT, setSelectedNFT] = useState('')


    function setNFT(img, id) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        //have to paste deployed contract
        const contract_address = process.env.NEXT_PUBLIC_MINTER_ADDRESS
        console.log(contract_address)
        const contract = new ethers.Contract(contract_address, Minter.abi, signer)
        contract.updateImageUrls(id, img).then(resp => {
            console.log(resp)
        })
    }

    return (
        <div className="m-24 border-2 ">
            <div>Add or modify your block image</div>
            {
                nfts ?
                    nfts.map((item, i) =>
                        <>
                            <div
                                className={`my-2 mx-2 flex-shrink-0 rounded-full w-32 h-32 ${selectedNFT == item.metadata.image ? 'hello border-4' : null}`}
                                key={i}
                                onClick={(e) => setSelectedNFT(item.metadata.image)}>
                                <div className="flex justify-center items-center imageContainer">
                                    <img
                                        style={{cursor: 'pointer'}}
                                        className="w-32 h-32 rounded-full drop-shadow-lg foregroundImg object-cover"
                                        src={item.metadata.image}
                                    />

                                </div>

                            </div>
                            <button className="mt-12 border-2 px-12 py-4 bg-white"
                                    onClick={() => setNFT(item.metadata.image, 1)}>SET NFT
                            </button>
                        </>
                    )
                    :
                    <p>No NFTs Available</p>

            }

        </div>
    )

}
