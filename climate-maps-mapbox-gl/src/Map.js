import './App.css';
import React, { useRef, useEffect, useState, useCallback } from 'react';
// eslint-disable-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import * as d3 from 'd3';
import Charts from './Charts';
import Menu from './Menu';
import mapboxgl from 'mapbox-gl'; // '!mapbox-gl';eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map() {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-93.9);
  const [lat, setLat] = useState(40.35);
  const [zoom, setZoom] = useState(3.5);
  const [showMenu, setShowMenu] = useState(0);
  useEffect(() => {

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });
    console.log('map', map)

    let reds = d3.interpolateOranges
    let extent = d3.extent([57784.48597, 6013.719748])
    let colorScale = d3.scaleLinear().domain(extent).range([0, 1])
    console.log(reds(colorScale(extent[0])))
    console.log(reds(colorScale(extent[1])))
    map.current.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.current.addSource("2018_emissions", {
        type: "vector",
        tiles: [
          `${process.env.REACT_APP_TILES_URL}/data/${process.env.REACT_APP_TILES_NAME}/{z}/{x}/{y}.pbf`
        ],
        // generateId: true // Uncomment to use feature states
      });

      map.current.addLayer({
        id: "2018_emissions_fill",
        type: "fill",
        source: "2018_emissions",
        "source-layer": "censustracts",
        paint: {
          'line-color': '#000',
          'line-width': 0.2
        },
        'minzoom': 2,
        'maxzoom': 13,
        filter: ["has", 'TOTAL']
      });


      map.current.addControl(new mapboxgl.NavigationControl());

    });
  });


  return (
    <div>

      <div ref={mapContainer} className='map-container'>
        <Menu map={map}></Menu>
        <Charts></Charts>
      </div>


    </div>
  );
}

export default Map;
