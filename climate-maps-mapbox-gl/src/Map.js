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
  const [showMenu, setShowMenu] = useState(false);
  const cityCordinates = {
    'Atlanta, GA': { lng: -84.32691971071415, lat: 33.759365066102475 },
    'Los Angeles--Long Beach--Anaheim, CA': { lng: -118.09434620224866, lat: 33.96924960228989 },
    'St. Louis, MO--IL': { lng: -90.29577958396759, lat: 38.632986685626975 },
    'Denver--Aurora, CO': { lng: -104.89981827848227, lat: 39.6333054378544 },
    'Chicago, IL--IN': { lng: -87.83848727610835, lat: 41.839959931547156 },
    'Cincinnati, OH--KY--IN': { lng: -84.47402669359252, lat: 39.11914999463926 },
    'Dallas--Fort Worth--Arlington, TX': { lng: -96.94387798448972, lat: 32.78937749956576 },
    'Cleveland, OH': { lng: -81.61977266135793, lat: 41.41286754953836 },
    'Boston, MA--NH--RI': { lng: -71.06392525738285, lat: 42.353758547637085 },
    'Houston, TX': { lng: -95.39933430454754, lat: 29.739488624385984 },
    'Minneapolis--St. Paul, MN--WI': { lng: -93.29106904224143, lat: 44.97973338940676 },
    'Philadelphia, PA': { lng: -75.14812601687287, lat: 39.95366720828446 },
    'Portland, OR--WA': { lng: -122.66092252301331, lat: 45.52153475485946 },
  }
  useEffect(() => {
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
          'fill-color': 'transparent',
          'fill-opacity': 0.7
        },
        'minzoom': 2,
        'maxzoom': 13,
        filter: ["has", 'TOTAL']
      });


      map.current.addLayer({
        id: "2018_emissions_outlines_cities",
        type: "line",
        source: "2018_emissions",
        "source-layer": "censustracts",
        paint: {
          'line-color': 'black',
          'line-width': 0.5,
          'line-opacity': 0.7
        },
        'minzoom': 2,
        'maxzoom': 13,
        filter: ["in", ['get', 'CITYNAME'], ['literal', ['Atlanta, GA', 'Los Angeles--Long Beach--Anaheim, CA', 'St. Louis, MO--IL', 'Denver--Aurora, CO', 'Chicago, IL--IN', 'Cincinnati, OH--KY--IN',
          'Dallas--Fort Worth--Arlington, TX', 'Cleveland, OH', 'Boston, MA--NH--RI', 'Houston, TX', 'Minneapolis--St. Paul, MN--WI',
          'Philadelphia, PA', 'Portland, OR--WA']]]
      });
      const cities = ['Atlanta, GA', 'Boston, MA--NH--RI', 'Chicago, IL--IN', 'Cincinnati, OH--KY--IN',
        'Cleveland, OH', 'Dallas--Fort Worth--Arlington, TX', 'Denver--Aurora, CO', 'Houston, TX', 'Los Angeles--Long Beach--Anaheim, CA', 'Minneapolis--St. Paul, MN--WI',
        'Philadelphia, PA', 'Portland, OR--WA', 'St. Louis, MO--IL'];
      
      map.current.addControl(new mapboxgl.NavigationControl());
      
      map.current.on('click', '2018_emissions_fill', (e) => {
        const cityName = e.features[0].properties.CITYNAME;
        const isUrbanArea = cities.includes(cityName);
        if (isUrbanArea) {
          const cords = cityCordinates[cityName];
          map.current.flyTo({
            center: [cords.lng, cords.lat],
            zoom: 8,
            duration: 2000,
            essential: true
            // pitch: 45,
          });
          new mapboxgl.Popup()
            .setLngLat(cords)
            .setHTML(cityName)
            .addTo(map.current);
        } else {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('Not an Urban Area')
            .addTo(map.current);
        }
      });

      map.current.on('mouseenter', 'states-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'states-layer', () => {
        map.getCanvas().style.cursor = '';
      });

      map.current.on('idle', function () {
        if (!showMenu)
          setShowMenu(!showMenu);
      })

    });
  });


  return (
    <div>

      <div ref={mapContainer} className='map-container'>
        <Menu show={showMenu} map={map} cityCordinates={cityCordinates}></Menu>
        <Charts></Charts>
      </div>


    </div>
  );
}

export default Map;
