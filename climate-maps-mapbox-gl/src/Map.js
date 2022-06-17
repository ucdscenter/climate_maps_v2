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
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(5);
  // const years = [];
  // const variables = [];
  const [showMenu, setShowMenu] = useState(0);
  useEffect(() => {
    // TODO: Remove commented code after testing
    // const gs = fetch('http://localhost:3000/data/census_tracts_geojson/2010/2010_moststates.json').then((res) => res.json()).then(data => {
    // let i = 0;
    // data.features.forEach(feature => {
    //   feature.properties.year = 2010;
    // });
    // var fileData = JSON.stringify(data);
    // const blob = new Blob([fileData], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.download = 'filename.json';
    // link.href = url;
    // link.click();

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });
    console.log('map', map)
    map.current.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.current.addSource("parcels", {
        type: "vector",
        tiles: [
          `${process.env.REACT_APP_TILES_URL}/data/${process.env.REACT_APP_TILES_NAME}/{z}/{x}/{y}.pbf`
        ],
        // generateId: true // Uncomment to use feature states
      });

      map.current.addLayer({
        id: "parcels-fill",
        type: "fill",
        source: "parcels",
        "source-layer": "censustracts",
        paint: {
          'fill-color': [
            'step',
            ['get', 'id'],
            '#51bbd6',
            100,
            '#f1f075',
            200,
            '#f28cb1'
          ],
          "fill-opacity": 0.5,
          "fill-outline-color": "black"
        },
        'minzoom': 2,
        'maxzoom': 13
      });



      // map.current.addSource('US_01', {
      //   'type': 'geojson',
      //   'data': data//'http://localhost:3000/data/census_tracts_geojson/2010/2010_moststates.json'
      // });
      // map.current.addSource('US_02', {
      //   'type': 'geojson',
      //   'data': 'http://localhost:3000/data/census_tracts_geojson/2010/2010_remainingstates.json'
      // });
      // map.current.addSource('US_03', {
      //   'type': 'geojson',
      //   'data': 'http://localhost:3000/data/census_tracts_geojson/2010/2010_layererrorstates.json'
      // });

      // // Add a new layer to visualize the polygon.
      // map.current.addLayer({
      //   'id': 'US_01',
      //   'type': 'fill',
      //   'source': 'US_01',
      //   'layout': {},
      //   'paint': {
      //     'fill-color': [
      //       'step',
      //       ['get', 'store'],
      //       '#51bbd6',
      //       10000,
      //       '#f1f075',
      //       20000,
      //       '#f28cb1'
      //     ],
      //     'fill-opacity': 0.4
      //   }
      // });
      // map.current.addLayer({
      //   'id': 'US_02',
      //   'type': 'fill',
      //   'source': 'US_02', 
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#0080ff',
      //     'fill-opacity': 0.4
      //   }
      // });
      // map.current.addLayer({
      //   'id': 'US_03',
      //   'type': 'fill',
      //   'source': 'US_03', 
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#0080ff',
      //     'fill-opacity': 0.4
      //   }
      // });
      // // Add a black outline around the polygon.
      // map.current.addLayer({
      //   'id': 'outline_01',
      //   'type': 'line',
      //   'source': 'US_01',
      //   'layout': {},
      //   'paint': {
      //     'line-color': '#000',
      //     'line-width': 0.2
      //   }
      // });
      // map.current.addLayer({
      //   'id': 'outline_02',
      //   'type': 'line',
      //   'source': 'US_02',
      //   'layout': {},
      //   'paint': {
      //     'line-color': '#000',
      //     'line-width': 0.2
      //   }
      // });
      // map.current.addLayer({
      //   'id': 'outline_03',
      //   'type': 'line',
      //   'source': 'US_03',
      //   'layout': {},
      //   'paint': {
      //     'line-color': '#000',
      //     'line-width': 0.2
      //   }
      // });
      map.current.addControl(new mapboxgl.NavigationControl());
      // });
    });
  });

  // const onMenuClick = () => {
  //   setShowMenu(!showMenu)
  //   map.current.setPaintProperty('parcels-fill', 'fill-color', [
  //     'step',
  //     ['get', 'store'],
  //     '#51bbd6',
  //     1000,
  //     '#f1f075',
  //     2000,
  //     '#f28cb1'
  //   ]);
  // };

  // for (let i = 2010; i < 2022; i++) {
  //   years.push(<a key={i} id={i} href='#' className='active'>{i}</a>);
  // }
  // for (let i = 0; i < 5; i++) {
  //   variables.push(<a key={i} id={i} href='#' className='active'>{i}</a>)
  // }

  return (
    <div>
      <div ref={mapContainer} className='map-container' />
      <Menu map={map}></Menu>
      <Charts></Charts>
    </div>
  );
}

export default Map;
