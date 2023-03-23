import './App.css';
import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Charts from './Charts';
import Menu from './Menu';
import * as d3 from 'd3';
import { Loader } from './Loader';
import mapboxgl from 'mapbox-gl'; // '!mapbox-gl';eslint-disable-line import/no-webpack-loader-syntax
import { supportedCities, supportedCityCordinates } from './constants';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map() {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const refYear = useRef('2000')
  const refComparisionYear = useRef('2018')
  const refVariable = useRef('TOTAL')
  const [year, updateYear] = useState('2000');
  const isIntialLoad = useRef(true);
  const lng = -93.9;
  const lat = 40.35;
  const zoom = 3.5;
  const [showMenu, setShowMenu] = useState(false);
  const [city, setCity] = useState(null);
  const [hoveredTract, setHoveredTract] = useState(null);
  const unhoverTract = useRef(null);
  const [variable, updateVariable] = useState('TOTAL');
  const csv = useRef(null);
  const [comparision_year, updateComparisionYear] = useState('2018');
  const color_scale = useRef(null);
  const showLoader = useRef(true);
  const setShowLoader = useRef((show) => { showLoader.current = show; });
  const updateColorScale = useRef((s) => { color_scale.current = s });
  const updateCsv = useRef((data) => { csv.current = data });
  const updateRefYear = useRef((data) => { refYear.current = data });
  const updateRefComparisonYear = useRef((data) => { refComparisionYear.current = data });
  const updateRefVariable = useRef((data) => { refVariable.current = data });
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
  const cities = useRef(supportedCities); 
  const cityCordinates = supportedCityCordinates;

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
        'minzoom': 7,
        'maxzoom': 13,
        filter: ["in", ['get', 'CITYNAME'], ['literal', supportedCities]]
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on('click', ['all_decades_emissions_fill', '2018_emissions_outlines_cities'], (e) => {
        console.log(e.features[0])
        const cityName = e.features[0].properties.CITYNAME;
        let property_key = refYear.current + '-' + refVariable.current;
        let variableValue = e.features[0].properties[property_key]
        var change;

        const isUrbanArea = cities.current.includes(cityName);
        let white = e.features[0].properties[refYear.current + '-' + 'WHITE']
        let tooltip_html = `% White in ${refYear.current}: ${percentFormat(white)} <div> <div> ${property_key}: ${emissionsFormat(variableValue)} Kilograms CO₂ <div>`;

        if (refComparisionYear.current != '-' && refComparisionYear.current != refYear.current) {
          property_key = refComparisionYear.current + '-' + refVariable.current;
          change =  e.features[0].properties[property_key] - variableValue;
          variableValue = e.features[0].properties[property_key];

          white = e.features[0].properties[refComparisionYear.current + '-' + 'WHITE']
          tooltip_html += `% White in ${refComparisionYear.current}: ${percentFormat(white)}<div> ${property_key}: ${emissionsFormat(variableValue)} Kilograms CO₂ ${emissionsFormat(change)}<div>`;
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
                setVariable={updateVariable}
                setCity={setCity}
                setYear={updateYear}
                setComparisionYear={updateComparisionYear}
                setRefVariable={updateRefVariable.current}
                setRefYear={updateRefYear.current}
                setRefComparisonYear={updateRefComparisonYear.current}
                setColorScale={updateColorScale.current}
                setShowLoader={setShowLoader.current}>
              </Menu>
              <Charts
                variable={variable}
                colorScale={color_scale.current}
                hoveredTract={hoveredTract}
                city={city}
                setCsv={updateCsv.current}
                year={year}
                comparision_year={comparision_year}
                setShowLoader={setShowLoader.current}
                highlightTract={highlightTract}
                unhighlightTract={unhighlightTract}>
              </Charts>
            </div>
          </div>
          <div className="col-4">
            <div className="row">
              <div className="col-12">
                <h2>Charts <img className='info-icon' src='/info-circle-black.svg' alt='chart-info' title='If no compare year is selected, each dot represents one census tract, mouseover said dot to highlight on the map. If a comparison year is selected, each arrow represents one census tract, beginning at the base year and ending at the comparison year, showing the change in % white population as well as change in emissions. A point moving down and to the left represents a census tract the is becoming less white and emmitting less over time'/>
            </h2>
              </div>
            </div>
            <div className="row">
              <h3 id="charts-title"></h3>
              <div id="white-variable" className="col-12">
              </div>
            </div>
            <div className="row">
              <h3 id="table-title"></h3>
              <div id="emissions-table" className="col-11" >

              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Map;
