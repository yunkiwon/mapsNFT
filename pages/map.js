import * as React from 'react';
import Map, {Source, Layer} from 'react-map-gl';

const geojson = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'point', coordinates: [-74.0, 40.7] }}
]
};


const layerStyle = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
};

export default function map() {
  return (
<div>   
  <Map
    initialViewState={{
            latitude: 40.75, 
            longitude: -73.97, 
            zoom: 12
    }}
    style={{width: 600, height: 500}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    mapboxAccessToken="pk.eyJ1Ijoia2l3b255dW4iLCJhIjoiY2w0dTFmN3VlMDdzaTNjbnp0Y2k0ZG9heiJ9.-a12UK1wm3QEPBfeuZ-MVQ"
    >
    <Source id="my-data" type="geojson" data={geojson}> 
      <Layer {...layerStyle} />
    </Source>
  </Map>;
</div> 
  )
}