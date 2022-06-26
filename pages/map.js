import React, {useEffect, useRef, useState} from 'react';
import {ethers} from 'ethers'
import mapboxgl from 'mapbox-gl';
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'
import * as ReactDOM from "react-dom";
import Wallet from "../components/Wallet";
import Sidebar from '../components/Sidebar'
import {hasEthereum} from '../utils/ethereum'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-73.949657);
    const [lat, setLat] = useState(40.791012);
    const [urls, setUrls] = useState(["", "", "", "", "", "", "", "", ""])
    const [currentImage, setCurrentImage] = useState("")
    const [userAddress, setUserAddress] = useState('')
    let imageUrls = {
        "Chelsea": {
            "id": 1,
            "coords": [-74.0014, 40.7465]
        },
        "West Village": {
            "id": 2,
            "coords": [-74.0048, 40.7347]
        },
        "Central Park": {
            "id": 3,
            "coords": [-73.9665, 40.7812]
        },
        "Kips Bay": {
            "id": 4,
            "coords": [-73.9801, 40.7423]
        },
        "East Village": {
            "id": 5,
            "coords": [-73.981, 40.7265]
        },
        "SoHo": {
            "id": 6,
            "coords": [-74.0019, 40.7246]
        },
        "Flatiron": {
            "id": 7,
            "coords": [-73.9897, 40.7411]
        },
        "Gramercy": {
            "id": 8,
            "coords": [-73.9845, 40.7368]
        },
        "Hells Kitchen": {
            "id": 9,
            "coords": [-73.9918, 40.7638]
        }
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/examples/cke97f49z5rlg19l310b7uu7j',
            center: [lng, lat],
            zoom: 11.1
        });
    });

    let hoveredStateId = null;


    useEffect(() => {
        console.log("HIT")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        //have to paste deployed contract
        const contract_address = process.env.NEXT_PUBLIC_MINTER_ADDRESS
        console.log(contract_address)
        const contract = new ethers.Contract(contract_address, Minter.abi, signer)
        contract.totalSupply().then(resp => {
            setTotalNftsMinted(resp.toNumber())
        })
        contract.getImageUrls().then(resp => {
            console.log(resp)
            if (!map.current) return; // wait for map to initialize
            map.current.on('load', () => {
                map.current.addSource('states', {
                    'type': 'geojson',
                    'data': 'https://raw.githubusercontent.com/yunkiwon/mapsNFT/main/neighborhoods.json'
                });
                map.current.addLayer({
                    'id': 'state-fills',
                    'type': 'fill',
                    'source': 'states',
                    'layout': {},
                    'paint': {
                        'fill-color': '#627BC1',
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            1,
                            0.5
                        ]
                    }
                });


                map.current.addLayer({
                    'id': 'state-borders',
                    'type': 'line',
                    'source': 'states',
                    'layout': {},
                    'paint': {
                        'line-color': '#627BC1',
                        'line-width': 2
                    }
                });

                map.current.on('click', 'state-fills', (e) => {
                    let coordinatesx = e.features[0].properties.pointx;
                    let coordinatesy = e.features[0].properties.pointy;
                    while (Math.abs(e.lngLat.lng - coordinatesx) > 180) {
                        coordinatesx += e.lngLat.lng > coordinatesx ? 360 : -360;
                    }

                    const popupNode = document.createElement("div")
                    ReactDOM.render(
                        <Popup name={e.features[0].properties.name} id={e.features[0].id}/>,
                        popupNode
                    )
                    setCurrentImage(resp[e.features[0].id - 1])
                    console.log(e.features[0].id)
                    new mapboxgl.Popup()
                        .setLngLat([coordinatesx, coordinatesy])
                        .setDOMContent(popupNode)
                        .addTo(map.current);
                });
                map.current.on('mousemove', 'state-fills', (e) => {
                    if (e.features.length > 0) {
                        if (hoveredStateId !== null) {
                            map.current.setFeatureState(
                                {source: 'states', id: hoveredStateId},
                                {hover: false}
                            );
                        }
                        hoveredStateId = e.features[0].id;
                        map.current.setFeatureState(
                            {source: 'states', id: hoveredStateId},
                            {hover: true}
                        );
                    }
                });
                map.current.on('mouseleave', 'state-fills', () => {
                    if (hoveredStateId !== null) {
                        map.current.setFeatureState(
                            {source: 'states', id: hoveredStateId},
                            {hover: false}
                        );
                    }
                    hoveredStateId = null;
                });
            });
        })
    }, []);


    //current # of minted nft's
    const [TotalNftsMinted, setTotalNftsMinted] = useState(0)

    const [ethInContract, setEthInContact] = useState(0)

    //will get the current number of nft's minted on initial load
    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        //have to paste deployed contract
        const contract_address = process.env.NEXT_PUBLIC_MINTER_ADDRESS
        console.log(contract_address)
        const contract = new ethers.Contract(contract_address, Minter.abi, signer)
        contract.totalSupply().then(resp => {
            setTotalNftsMinted(resp.toNumber())
        })
        contract.getImageUrls().then(resp => {
            setUrls(resp)
        })

        const balance = provider.getBalance(contract_address).then((resp) => {
            console.log("BALANCE ", ethers.utils.formatEther(resp))
            setEthInContact(ethers.utils.formatEther(resp))

        })

    }, [])


    const mintNFT = (id) => {
        console.log(id)
        console.log("mintNFT")
        //have to deploy a contract on hardhat local and paste address into env file
        const contract_address = process.env.NEXT_PUBLIC_MINTER_ADDRESS
        console.log(contract_address)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const options = {value: ethers.utils.parseEther(".3")}
        const contract = new ethers.Contract(contract_address, Minter.abi, signer)
        contract.mint(id, options).then(resp => {
            console.log("minted 1 ", resp)
            setTotalNftsMinted(TotalNftsMinted + 1)
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        getAddress()
    }, [])

    async function getAddress() {
        if (!hasEthereum()) return
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            setUserAddress(address)
        } catch (error) {
            console.log(error)
        }
    }

    const Popup = ({name, id}) => (
        <div className="popup">
            <strong>{name} Block:</strong>
            <button onClick={() => mintNFT(id)}>
                {
                    urls[id] === '' || urls[id] === undefined ? "MINT NFT" : "TAKEN, FUCK OFF"
                }
            </button>
        </div>
    )

    return (
        <div>
            <Wallet/>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            {currentImage === "" ? null : <img
                className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 border hover:border-gray-300 focus:border-gray-300 rounded shadow-lg absolute top-32 right-4 lg:top-32 lg:right-36 p-4 flex items-center text-xs disabled:cursor-not-allowed"
                style={{top: "16rem"}}
                src={currentImage}/>}


            <div className="w-full h-full content-center flex flex-col">
                <h1> NFTs Minted: {TotalNftsMinted}</h1>
                <h1> Total Eth in Contract: {ethInContract}</h1>
                <Sidebar address={userAddress}/>
                <div ref={mapContainer} className="map-container" id="map"/>
            </div>
        </div>
    )
}


