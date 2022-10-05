import './App.css';
import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
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
  const isIntialLoad = useRef(true);
  const [lng, setLng] = useState(-93.9);
  const [lat, setLat] = useState(40.35);
  const [zoom, setZoom] = useState(3.5);
  const [showMenu, setShowMenu] = useState(false);
  console.log('setting variable again'.variable);
  const [city, setCity] = useState(null);
  const [hoveredTract, setHoveredTract] = useState(null);
  const [reloadTable, setReloadTable] = useState(null);
  // TODO: Remove after new mbtiles
  // const [csv, setCsv] = useState(null);
  const csv = useRef(null);
  const variable = useRef('FOOD');
  // const [variable, setVariable] = useState(null);
  console.log('executing')

  const updateVariable = useRef((v) => { variable.current = v; console.log('set state of variable', v) });
  const updateCsv = useRef((data) => { console.log('csv', csv); csv.current = data });

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

  if (isIntialLoad.current) {
    isIntialLoad.current = false;
  }
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

          'fill-opacity': 0.8
        },
        'minzoom': 2,
        'maxzoom': 13,
        filter: ["has", '2018']
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

      map.current.on('click', ['2018_emissions_fill', '2018_emissions_outlines_cities'], (e) => {
        const cityName = e.features[0].properties.CITYNAME;
        const variableValue = e.features[0].properties[variable.current]
        const isUrbanArea = cities.includes(cityName);
        console.log(city)
        const row = csv && csv.current ? csv.current.find(data => data.GEOID == e.features[0].properties.GEOID10) : {};
        const white = row && row.WHITE //e.features[0].properties.WHITE;
        if (isUrbanArea) {
          const cords = cityCordinates[cityName];
          map.current.flyTo({
            center: [cords.lng, cords.lat],
            zoom: 8,
            duration: 2000,
            essential: true,
          });
          setCity(cityName);
          new mapboxgl.Popup()
            .setLngLat(cords)
            .setHTML(`<div> City: ${cityName}</div> <div>% White: ${white} <div> <div> ${variable.current}: ${variableValue} <div>`)
            .addTo(map.current);
        } else {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div> City: Not an urban area</div> <div>% White: ${white} <div> <div> ${variable.current}: ${variableValue} <div>`)
            .addTo(map.current);
        }
      });

      map.current.on('mousemove', ['2018_emissions_outlines_cities', '2018_emissions_fill'], (e, x) => {
        if (e.features.length > 0 && e.features[0].properties) {
          // if (hoveredTract !== null) {
          //   map.setFeatureState(
          //     { source: 'states', id: hoveredTract },
          //     { hover: false }
          //   );
          // }
          setHoveredTract(e.features[0].properties['GEOID10']);
          // map.setFeatureState(
          //   { source: 'states', id: hoveredTract },
          //   { hover: true }
          // );
        }
      });

      map.current.on('mouseenter', ['2018_emissions_outlines_cities', '2018_emissions_fill'], () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', ['2018_emissions_outlines_cities', '2018_emissions_fill'], () => {
        map.current.getCanvas().style.cursor = '';
      });

      map.current.on('idle', function () {
        if (!showMenu)
          setShowMenu(!showMenu);
      })
    });
  });


  return (
    <div>
    <div className="container-flex">
        <div className="row">
          <div className="col-8 h-75">
            <div ref={mapContainer} className='map-container'>
              <Menu show={showMenu} map={map} cityCordinates={cityCordinates} setVariable={updateVariable.current} setCity={setCity}></Menu>
              <Charts variable={variable.current} hoveredTract={hoveredTract} city={city} setCsv={updateCsv.current}></Charts>
            </div>
          </div>
          <div className="col-4">
            <div className="row">
              <div className="col-12">
                <h2>Charts</h2>
              </div>
            </div>
            <div className="row">
              <h3 id="charts-title"></h3>
              <div id="white-variable" className="col-12">
              </div>
            </div>
            <div className="row">
              <div id="emissions-table" className="col-12">
                <h3 id="table-title"></h3>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Map;
