import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax


function App() {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });
    map.current.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.current.addSource('US_01', {
        'type': 'geojson',
        'data': 'http://localhost:3000/data/census_tracts_geojson/2010/2010_moststates.json'
      });
      map.current.addSource('US_02', {
        'type': 'geojson',
        'data': 'http://localhost:3000/data/census_tracts_geojson/2010/2010_remainingstates.json'
      });
      map.current.addSource('US_03', {
        'type': 'geojson',
        'data': 'http://localhost:3000/data/census_tracts_geojson/2010/2010_layererrorstates.json'
      });

      // Add a new layer to visualize the polygon.
      map.current.addLayer({
        'id': 'US_01',
        'type': 'fill',
        'source': 'US_01', 
        'layout': {},
        'paint': {
          'fill-color': '#0080ff',
          'fill-opacity': 0.4
        }
      });
      map.current.addLayer({
        'id': 'US_02',
        'type': 'fill',
        'source': 'US_02', 
        'layout': {},
        'paint': {
          'fill-color': '#0080ff',
          'fill-opacity': 0.4
        }
      });
      map.current.addLayer({
        'id': 'US_03',
        'type': 'fill',
        'source': 'US_03', 
        'layout': {},
        'paint': {
          'fill-color': '#0080ff',
          'fill-opacity': 0.4
        }
      });
      // Add a black outline around the polygon.
      map.current.addLayer({
        'id': 'outline_01',
        'type': 'line',
        'source': 'US_01',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 0.2
        }
      });
      map.current.addLayer({
        'id': 'outline_02',
        'type': 'line',
        'source': 'US_02',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 0.2
        }
      });
      map.current.addLayer({
        'id': 'outline_03',
        'type': 'line',
        'source': 'US_03',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 0.2
        }
      });
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
