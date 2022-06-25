import { useState, useRef } from 'react'
import ReactMapGL from "react-map-gl"

export default function map() {

  const [viewport, setViewport] = useState({
      latitude: 40.7831, 
      longitude: -73.9712, 
      width: "100vw", 
      height: "100vh", 
      zoom: 10 
  })
  return (
    <div>
    <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v9"
        {...viewport}
        mapboxAccessToken="pk.eyJ1Ijoia2l3b255dW4iLCJhIjoiY2w0dTFmN3VlMDdzaTNjbnp0Y2k0ZG9heiJ9.-a12UK1wm3QEPBfeuZ-MVQ"
    >

    </ReactMapGL>
    </div>
  ) 
}
