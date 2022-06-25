import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-73.949657);
    const [lat, setLat] = useState(40.791012);

    let imageUrls = {
        "Chelsea": {
            "url": "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
            "coords": [-74.0014, 40.7465]
        },
        "Harlem": {
            "url": "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
            "coords": [-73.9465, 40.8116]
        },
        "SoHo": {
            "url": "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
            "coords": [-74.0019, 40.7246]
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
        if (!map.current) return; // wait for map to initialize
        map.current.on('load', () => {
            map.current.addSource('states', {
                'type': 'geojson',
                'data': 'https://raw.githubusercontent.com/yunkiwon/mapsNFT/main/neighborhoods.json'
            });
            Object.keys(imageUrls).forEach(function(key) {
                let value = imageUrls[key];
                map.current.loadImage(
                    value["url"],
                    (error, image) => {
                        if (error) throw error;

                        map.current.addImage(key, image);

                        map.current.addSource(key, {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': value["coords"]
                                        }
                                    }
                                ]
                            }
                        });

                        map.current.addLayer({
                            'id': key,
                            'type': 'symbol',
                            'source': key,
                            'layout': {
                                'icon-image': key,
                                'icon-size': 0.125
                            }
                        });
                    }
                );
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
            map.current.on('mousemove', 'state-fills', (e) => {
                if (e.features.length > 0) {
                    if (hoveredStateId !== null) {
                        map.current.setFeatureState(
                            { source: 'states', id: hoveredStateId },
                            { hover: false }
                        );
                    }
                    hoveredStateId = e.features[0].id;
                    map.current.setFeatureState(
                        { source: 'states', id: hoveredStateId },
                        { hover: true }
                    );
                }
            });
            map.current.on('mouseleave', 'state-fills', () => {
                if (hoveredStateId !== null) {
                    map.current.setFeatureState(
                        { source: 'states', id: hoveredStateId },
                        { hover: false }
                    );
                }
                hoveredStateId = null;
            });
        });
    });

    return (
        <div>
            <div ref={mapContainer} className="map-container" id="map"/>
        </div>
    );
}
