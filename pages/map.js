import * as React from 'react';
import {useState, useEffect, useMemo, useCallback} from 'react';
import {render} from 'react-dom';
import Map, {Source, Layer} from 'react-map-gl';

import {dataLayer} from '../components/mapStyle';

const MAPBOX_TOKEN = 'eyJ1Ijoia2l3b255dW4iLCJhIjoiY2w0dTFnaDdyMHFrNjNsb2IxYnJjM2xoZCJ9.3DixWgkoFgNo5Tbde6WZNA'; // Set your mapbox token here

export default function App() {
  const [year, setYear] = useState(2015);
  const [allData, setAllData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch(
      'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
    )
      .then(resp => resp.json())
      .then(json => setAllData(json))
      .catch(err => console.error('Could not load data', err)); // eslint-disable-line
  }, []);

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const data = useMemo(() => {
    return allData;
  }, [allData, year]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onMouseMove={onHover}
      >
        <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>State: {hoverInfo.feature.properties.name}</div>
            <div>Median Household Income: {hoverInfo.feature.properties.value}</div>
            <div>Percentile: {(hoverInfo.feature.properties.percentile / 8) * 100}</div>
          </div>
        )}
      </Map>

    </>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}