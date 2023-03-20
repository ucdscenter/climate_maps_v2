import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import emissions_range from './emissions_range.json';
import emissions_range_across_years from './emissions_range_across_years.json';
// import jenks_breaks from './jenks_distribution.json'
import jenks_distribution_across_years from './jenks_distribution_across_years.json';

import property_dist_info from './property_dist_info.json'
import { supportedCities } from './constants';

function Menu({ show, map, cityCordinates, setVariable, setCity, setYear, setComparisionYear, setColorScale, setRefYear, setRefComparisonYear, setRefVariable }) {
    const years = [];
    const allYears = ['1980', '1990', '2000', '2010', '2018'];
    const comparisions_years = [[<option key='comparision-default' value='-' id='comparision-default' href='#' className='active'>-</option>]]
    let year = useRef('2000');
    let comparision_year = useRef('2018')
    let variable = useRef('TOTAL');
    const isInitialRender = useRef(true);

    const variables = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL'];
    const cities = ['-', ...supportedCities]
    const variablesList = [];
    const citiesList = [];
    const getBackgroundColor = (color) => { return { "backgroundColor": color } };
    const [showLegend, setShowLegend] = useState(0);
    const [emissionsLegend, setEmissionsLegend] = useState([]);
    useEffect(() => {
        if (!show)
            return;
        if (isInitialRender.current) {
            isInitialRender.current = false;
            setVariable(variable.current)
            setTimeout(() =>
                onMenuClick(), 1000);
        }
    });
    const onMenuClick = () => {
        if (map.current)
            setPaintProperty(year.current, comparision_year.current, variable.current)
    };
    const onVariableClick = (e) => {
        if (!map.current)
            return;

        variable.current = e.target.value;
        setVariable(variable.current);
        setRefVariable(variable.current);
        setPaintProperty(year.current, comparision_year.current, variable.current);
    };
    const onYearClick = (e) => {
        year.current = e.target.value;
        setYear(year.current);
        setRefYear(year.current);
        setPaintProperty(year.current, comparision_year.current, variable.current);
    };

    const onComparisionYearClick = (e) => {
        comparision_year.current = e.target.value;
        setComparisionYear(comparision_year.current);
        setRefComparisonYear(comparision_year.current);
        setPaintProperty(year.current, comparision_year.current, variable.current);
    };


    const onCityClick = (e) => {
        const city = e.target.value;
        if (city === '-') {
            setCity(null);
            map.current.flyTo({
                center: [-93.9, 40.35],
                zoom: 3.5,
                pitch: 0,
                duration: 2000,
                essential: true
            });
            return;
        }
        setCity(city);
        const cords = cityCordinates[city];
        map.current.flyTo({
            center: [cords.lng, cords.lat],
            zoom: 8,
            duration: 2000,
            essential: true
        });
    };
    const setPaintProperty = (year, comparision_year, variable) => {
        console.log(year, comparision_year, variable)
        let isComparision = false
        let property_key = year + '-' + variable;
        const reds = [], greens = [], greys = [];
        const ylorrd = [];
        let [range, layerName] = [emissions_range_across_years[variable], `all_decades_emissions_fill`];
        let distribution_key = variable
        if (comparision_year !== '-' && comparision_year !== year) {
            range = emissions_range_across_years['COMPARISION-' + variable];
            isComparision = true;
            const base = Number(year);
            const comparision = Number(comparision_year);


            if (base > comparision) {
                alert('Base year must be before the comparision year.');
                setComparisionYear('-');
                return;
            }

            year = base + '-' + comparision;
            property_key = year + '-' + variable;
            distribution_key = 'COMPARISION-' + variable
        }

        let breaks_num = 7

        for (let i = 0; i <= breaks_num; i++) {
            greys.push(d3.interpolateGreys(i / breaks_num));
            reds.push(d3.interpolateReds(i / breaks_num));
            greens.push(d3.interpolateGreens((breaks_num - i) / breaks_num));
            ylorrd.push(d3.interpolateBrBG(1 - (i / breaks_num)))

        }
        map.current.setFilter(layerName, ["has", property_key]);
        const prop_dist = property_dist_info[property_key]
        let emissionsLegend = [<h6 className='subheading'>mean: {Math.round(prop_dist.mean)}, stdev: {Math.round(prop_dist.std)} </h6>, <div key="no-data"><span style={getBackgroundColor('#ffffff')}></span>No Data</div>];

        const groups = [-3, -2, -1, 0, 0.001, 1, 2, 3]
        const breaks = groups.map(function (p) {
            if (p == -3) {
                return prop_dist.min
            }
            if (p == 3) {
                return prop_dist.max
            }
            return prop_dist.mean + (p * prop_dist.std)
        })
        // const breaks = jenks_distribution_across_years[distribution_key]
        let style = [
            //'interpolate',
            //['linear'],
            'step',
            ['get', property_key]
        ];

        let greyIndex = 0, redIndex = 0, greenIndex = 0;
        const colorScheme = [];
        for (let i = 1; i < breaks.length; i++) {
            let color;
            if (!isComparision) {
                color = greys[greyIndex++];
            }
            else {
                color = ylorrd[greyIndex++];
            }
            /* else if (breaks[i] < 0) {
                color = greens[greenIndex++];
            } else {
                color = reds[redIndex++];
            }*/
            colorScheme.push(color);
            // if(i < breaks.length - 1){
            //     style.push(breaks[i], ['to-color', color]);
            // }

            style.push(color)
            if (i < breaks.length - 1) {
                style.push(breaks[i])
            }


            emissionsLegend.push(<div key={i}><span style={getBackgroundColor(color)}></span>{Math.round(breaks[i - 1])} to {Math.round(breaks[i])}</div>);
        }
        console.log(style)
        style = ['case', ['boolean', ['feature-state', 'hover'], false], 'black', style]
        map.current.setPaintProperty(layerName, 'fill-color', style);
        const colorInterpolator = (i) => {
            if (i < 0 || i > 10) {
                return "rgb(0,0,0)";
            }
            return colorScheme[i];
        }
        setColorScale([range, colorScheme, breaks]);
        setEmissionsLegend(emissionsLegend);
        if (!showLegend) {
            setShowLegend(!showLegend);
        }

    }//setPaintProperty

    allYears.forEach(i => {
        years.push(<option key={i} value={i} id={i} href='#' className='active'>{i}</option>);
        const comparision_year = 'comparision-' + i;
        comparisions_years.push(<option key={comparision_year} value={i} id={comparision_year} href='#' className='active'>{i}</option>);
    })


    variables.forEach((variable, i) =>
        variablesList.push(<option key={variable} value={variable} id={i} href='#' className='active'>{variable}</option>));

    cities.forEach((city, i) =>
        citiesList.push(<option key={city} value={city} id={i} href='#' className='active'>{city}</option>));

    if (!show)
        return null;
    return (
        <div className={show ? undefined : 'hide'}>
            <img id='menu-icon' className='top-left over-map hide' onClick={onMenuClick.bind(this)} src='/menu-squared-48.png' alt='Menu'></img>
            <nav id='menu' className={`top-left over-map`}>
                <div>
                    <h4>Explore the Map</h4>
                    <h6>The neutral color is the mean of emissions for each decade and each new color is the number of standard deviations from mean.</h6>
                    <div className="mb-2">
                        <label htmlFor="variables">1. Select a variable:</label>
                        <select className="form-select" name="variables" value={variable.current} id="variables" onChange={onVariableClick}>
                            {variablesList}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="years">2. Select a base year:</label>
                        <select className="form-select" name="years" id="years" value={year.current} onChange={onYearClick}>
                            {years}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="comparision-years">3. Select a comparison year (optional):</label>
                        <select className="form-select" name="comparision-years" id="comparision-years" value={comparision_year.current} onChange={onComparisionYearClick}>
                            {comparisions_years}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="cities"><b>4. Select a city:</b></label>
                        <select className="form-select" name="cities" id="cities" onChange={onCityClick}>
                            {citiesList}
                        </select>
                    </div>
                </div>
            </nav>
            <div id="emissions-legend" className={`legend ${showLegend ? undefined : 'hide'}`}>
                <div className="emissions-legend-title">
                    <h4>Emissions </h4>
                    <img className='info-icon' src='/info-circle.svg' alt='info' title='The neutral color is the mean of emissions for each decade and each new color is the number of standard deviations from mean.'/>
                </div>
                <h6 className='subheading'>(In Kilograms of CO₂)</h6>
                {emissionsLegend}
            </div>
        </div>
    );
}

export default Menu;
