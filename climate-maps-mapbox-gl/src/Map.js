import './App.css';
import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import Charts from './Charts';
import Menu from './Menu';
import * as d3 from 'd3';
import { Loader } from './Loader';
import mapboxgl from 'mapbox-gl'; // '!mapbox-gl';eslint-disable-line import/no-webpack-loader-syntax
import { supportedCities, supportedCityCordinates, supportedYears } from './constants';
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
        const geoid = e.features[0].properties.GEOID10;


        const isUrbanArea = cities.current.includes(cityName);
        const points = [];
        supportedYears.forEach(year => {
          const property_key = year + '-' + refVariable.current;
          const variableValue = e.features[0].properties[property_key]
          const y = Number(emissionsFormat(variableValue));
          const white_val = e.features[0].properties[year +  '-WHITE'];
          console.log(y)
          console.log(white_val)
          console.log(e.features[0].properties)
          if (!isNaN(y) && !isNaN(white_val)) {
            points.push({ x: year, y: [variableValue, white_val] });
          }
        });
        console.log(points)
        const lineColor = ['rgb(25, 123, 115)','rgb(161, 102, 27)']//points[0].y < points[points.length - 1].y ? 'rgb(161, 102, 27)' : 'rgb(25, 123, 115)';
        const tooltip_html = createTooltipSvg(points, 400, 250, lineColor, '1', 'Years', [`${refVariable.current} Emissions (Kilograms CO₂)`, '% White']);
        let title = isUrbanArea ? `<h6 class='map-popup-title'> CITY: ${cityName}, GEOID: ${geoid}</h6>` : `<h6 class='map-popup-title'>GEOID: ${geoid}</h6>`;

        new mapboxgl.Popup()
          .addClassName('map-popup')
          .setLngLat(e.lngLat)
          .setHTML(title + tooltip_html)
          .addTo(map.current);
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
                <h2>Charts <img className='info-icon' src='/info-circle-black.svg' alt='chart-info' title='If no compare year is selected, each dot represents one census tract, mouseover said dot to highlight on the map. If a comparison year is selected, each arrow represents one census tract, beginning at the base year and ending at the comparison year, showing the change in % white population as well as change in emissions. A point moving down and to the left represents a census tract the is becoming less white and emmitting less over time' />
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


function createTooltipSvg(points, width, height, color, strokeWidth, xLabel, yLabel) {
  console.log(points);
  const g_height = height/2;


  const tooltip_formats = [null, d3.format('.0%')];
  const yearFormat = d3.format('.4');
  const r = 3;
  const marginTop = 20; 
  const marginRight = 10; 
  const marginBottom = 30; 
  const marginLeft = 45; 
  const inset = r * 2; 
  const insetTop = inset; 
  const insetRight = inset; 
  const insetBottom = inset; 
  const insetLeft = inset; 
  const xRange = [marginLeft + insetLeft, width - marginRight - insetRight];
  const yRange = [g_height - marginBottom - insetBottom, marginTop + insetTop];
  const X = points.map(x => x.x).sort();
  const xExtent =  d3.extent(points, function (d) { return d.x; });
  const xScale = d3.scaleLinear(xExtent, xRange);
  
  const xAxis = d3.axisBottom(xScale).tickValues(X).ticks(5, yearFormat);
  
  const div = document.createElement('div');

 for (var i=0; i< 2; i++){

  let yExtent = [0, 1];
  if (i == 0){
    yExtent = [0,d3.extent(points, function (d) { return d.y[i]; })[1]];
  }
  const yScale = d3.scaleLinear(yExtent, yRange);
  const yAxis = d3.axisLeft(yScale).ticks(4, tooltip_formats[i]);

  let svg = d3.create("svg")
    .attr("width", width)
    .attr("height", g_height)
    .attr("viewBox", [0, 0, width, g_height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`)
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", g_height - (marginBottom + marginTop))
    .attr("width", width - (marginLeft + marginRight))
    .style("fill", "#fff")



  let line = d3.line()
    .x(function (d) { return xScale(d.x); })
    .y(function (d) { return yScale(d.y[i]); });

  svg.append('path')
    .datum(points)
    .attr('fill', 'none')
    .attr('stroke', color[i])
    .attr('stroke-width', strokeWidth)
    .attr('d', line);

  svg.selectAll(".tooltip-circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", function(d){
        return xScale(d.x)
      })
      .attr("cy", function(d){
        return yScale(d.y[i])
      })
      .attr("r", 5)
      .style("fill", color[i])
      .append("svg:title").text(function(d){
        if(i == 0){
          return d3.format(.6)(d.y[i])
        }
        else{
          return tooltip_formats[i](d.y[i])
        }
      })

  svg.append("g")
    .attr("transform", `translate(0,${g_height - marginBottom})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("y2", marginTop + marginBottom - g_height)
      .attr("stroke-opacity", 0.5))
    .call(g => g.append("text")
      .attr("x", width)
      .attr("y", marginBottom - 4)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text(xLabel));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(yLabel[i]));
  div.appendChild(svg.node());

}
  return div.innerHTML;
}

export default Map;
