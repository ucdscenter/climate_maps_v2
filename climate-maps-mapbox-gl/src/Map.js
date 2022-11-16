import './App.css';
import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Charts from './Charts';
import Menu from './Menu';
import * as d3 from 'd3';
import { Loader } from './Loader';
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
  const [city, setCity] = useState(null);
  const [hoveredTract, setHoveredTract] = useState(null)
  const unhoverTract = useRef(null)
  // TODO: Remove after new mbtiles
  // const [csv, setCsv] = useState(null);
  const csv = useRef(null);
  const variable = useRef('TOTAL');
  const year = useRef('2000');
  const comparision_year = useRef('2018');
  const color_scale = useRef(null);
  // const [variable, setVariable] = useState(null);
  const showLoader = useRef(true);
  const setShowLoader = useRef((show) => { showLoader.current = show; });
  const updateVariable = useRef((v) => { variable.current = v; console.log('set state of variable', v) });
  const updateColorScale = useRef((s) => { color_scale.current = s });
  const updateCsv = useRef((data) => { console.log('csv', csv); csv.current = data });
  const updateYear = useRef((data) => { console.log('year', year); year.current = data });
  const updateComparisionYear = useRef((data) => { console.log('comparisionYear', comparision_year); comparision_year.current = data });
  const highlightTract = (geoid) => {
    if (unhoverTract.current !== null) {
      map.current.setFeatureState(
        { source: '2018_emissions', sourceLayer: "censustracts", id: unhoverTract.current },
        { hover: false }
      );
    }
    unhoverTract.current = geoid;
    map.current.setFeatureState(
      { source: '2018_emissions', sourceLayer: "censustracts", id: geoid },
      { hover: true }
    );
  };
  const unhighlightTract = () => {
    if (unhoverTract.current !== null) {
      map.current.setFeatureState(
        { source: '2018_emissions', sourceLayer: "censustracts", id: unhoverTract.current },
        { hover: false }
      );
    }
  };
  const percentFormat = d3.format('.2%');
  const emissionsFormat = d3.format('.2f');
  const cities = useRef(['Atlanta, GA', 'Los Angeles--Long Beach--Anaheim, CA', 'St. Louis, MO--IL', 'Denver--Aurora, CO', 'Chicago, IL--IN', 'Cincinnati, OH--KY--IN',
    'Dallas--Fort Worth--Arlington, TX', 'Cleveland, OH', 'Boston, MA--NH--RI', 'Houston, TX', 'Minneapolis--St. Paul, MN--WI',
    'Philadelphia, PA--NJ--DE--MD', 'Portland, OR--WA']);
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
    'Philadelphia, PA--NJ--DE--MD': { lng: -75.14812601687287, lat: 39.95366720828446 },
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
        promoteId: 'GEOID10'
      });

      map.current.addLayer({
        id: "all_decades_emissions_fill",
        type: "fill",
        source: "2018_emissions",
        "source-layer": "censustracts",
        paint: {
          'fill-color': 'transparent',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.8],
        },
        'minzoom': 2,
        'maxzoom': 13,
        // filter: ["has", 'GEOID10']
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
          'Philadelphia, PA--NJ--DE--MD', 'Portland, OR--WA']]]
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on('click', ['all_decades_emissions_fill', '2018_emissions_outlines_cities'], (e) => {
        console.log(e.features[0])
        const cityName = e.features[0].properties.CITYNAME;
        let property_key = year.current + '-' + variable.current;
        let variableValue = e.features[0].properties[property_key]

        const isUrbanArea = cities.current.includes(cityName);
        let white = e.features[0].properties[year.current + '-' + 'WHITE']
        let tooltip_html = `% White in ${year.current}: ${percentFormat(white)} <div> <div> ${property_key}: ${emissionsFormat(variableValue)} Kilograms CO₂ <div>`;

        if (comparision_year.current != '-' && comparision_year.current != year.current) {
          property_key = comparision_year.current + '-' + variable.current;
          variableValue = e.features[0].properties[property_key];
          white = e.features[0].properties[comparision_year.current + '-' + 'WHITE']
          tooltip_html += `% White in ${comparision_year.current}: ${percentFormat(white)}<div> ${property_key}: ${emissionsFormat(variableValue)} Kilograms CO₂ <div>`;
        }
        console.log(city)

        //if (isUrbanArea && cityName != city.current) {

        if (isUrbanArea) {
          setCity(cityName);
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div> City: ${cityName}</div> <div>` + tooltip_html)
            .addTo(map.current);
        } else {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div></div> <div>` + tooltip_html)
            .addTo(map.current);
        }
      });

      map.current.on('mousemove', ['2018_emissions_outlines_cities', 'all_decades_emissions_fill'], (e, x) => {
        if (e.features.length > 0 && e.features[0].properties) {
          const geoid = e.features[0].properties['GEOID10'];
          highlightTract(geoid);
          setHoveredTract(geoid);
        }
      });

      map.current.on('mouseenter', ['2018_emissions_outlines_cities', 'all_decades_emissions_fill'], () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', ['2018_emissions_outlines_cities', 'all_decades_emissions_fill'], () => {
        map.current.getCanvas().style.cursor = '';
        unhighlightTract();
      });

      map.current.on('idle', function () {
        if (!showMenu)
          setShowMenu(!showMenu);
        if (showLoader.current)
          setShowLoader(false)
      })
    });
  });


  return (
    <div>
      <div className="container-flex">
        <div className="row">
          <div className="col-8 h-100">
            <Loader show={showLoader.current}></Loader>
            <div ref={mapContainer} className='map-container'>
              <Menu
                show={showMenu}
                map={map}
                cityCordinates={cityCordinates}
                setVariable={updateVariable.current}
                setCity={setCity}
                setYear={updateYear.current}
                setComparisionYear={updateComparisionYear.current}
                setColorScale={updateColorScale.current}
                setShowLoader={setShowLoader.current}>
              </Menu>
              <Charts
                variable={variable.current}
                colorScale={color_scale.current}
                hoveredTract={hoveredTract}
                city={city}
                setCsv={updateCsv.current}
                year={year.current}
                comparision_year={comparision_year.current}
                setShowLoader={setShowLoader.current}
                highlightTract={highlightTract}
                unhighlightTract={unhighlightTract}>
              </Charts>
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
              <div id="emissions-table" className="col-11" >

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
