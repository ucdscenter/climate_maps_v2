import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import emissions_range from './emissions_range.json';
import emissions_range_across_years from './emissions_range_across_years.json';
// import jenks_breaks from './jenks_distribution.json'
import jenks_distribution_across_years from './jenks_distribution_across_years.json';

function Menu({ show, map, cityCordinates, setVariable, setCity, setYear, setComparisionYear, setColorScale }) {
    const years = [];
    const allYears = ['1980', '1990', '2000', '2010', '2018'];
    const comparisions_years = [[<option key='comparision-default' value='-' id='comparision-default' href='#' className='active'>-</option>]]
    let year = useRef('1980');
    let comparision_year = useRef('-')
    let variable = useRef('FOOD');
    const isInitialRender = useRef(true);

    const variables = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL', 'WHITE'];
    const cities = ['-', 'Atlanta, GA', 'Boston, MA--NH--RI', 'Chicago, IL--IN', 'Cincinnati, OH--KY--IN',
        'Cleveland, OH', 'Dallas--Fort Worth--Arlington, TX', 'Denver--Aurora, CO', 'Houston, TX', 'Los Angeles--Long Beach--Anaheim, CA', 'Minneapolis--St. Paul, MN--WI',
        'Philadelphia, PA--NJ--DE--MD', 'Portland, OR--WA', 'St. Louis, MO--IL']
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
        setPaintProperty(year.current, comparision_year.current, variable.current);
    };
    const onYearClick = (e) => {
        year.current = e.target.value;
        setYear(year.current)
        setPaintProperty(year.current, comparision_year.current, variable.current);
    };

    const onComparisionYearClick = (e) => {
        comparision_year.current = e.target.value;
        setComparisionYear(comparision_year.current);
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
        let [range, layerName] = [emissions_range_across_years[variable], `all_decades_emissions_fill`];
        let distribution_key = variable
        if (comparision_year !== '-' && comparision_year !== year) {
            range = emissions_range_across_years['COMPARISION-' + variable];
            isComparision = true;
            const base = Number(year);
            const comparision = Number(comparision_year);


            if (base > comparision) {
                alert('Base year must be before the comparision year.');
                return;
            }

            year = base + '-' + comparision;
            property_key = year + '-' + variable;
            distribution_key = 'COMPARISION-' + variable
        }

        for (let i = 0; i <= 10; i++) {
            greys.push(d3.interpolateGreys(i / 10));
            reds.push(d3.interpolateReds(i / 10));
            greens.push(d3.interpolateGreens((10 - i) / 10));
        }

        let emissionsLegend = [<div key="no-data"><span style={getBackgroundColor('#ffffff')}></span>No Data</div>];

        map.current.setFilter(layerName, ["has", property_key]);
        const breaks = jenks_distribution_across_years[distribution_key]
        const style = [
            'interpolate',
            ['linear'],
            ['get', property_key]
        ];

        let greyIndex = 0, redIndex = 0, greenIndex = 0;
        const colorScheme = [];
        
        for(let i = 1; i < breaks.length; i++){
            let color;
            if (!isComparision) {
                color = greys[greyIndex++];
            } else if (breaks[i] < 0) {
                color = greens[greenIndex++];
            } else {
                color = reds[redIndex++];
            }
            colorScheme.push(color);
            style.push(breaks[i], ['to-color', color]);
            emissionsLegend.push(<div key={i}><span style={getBackgroundColor(color)}></span>{Math.round(breaks[i-1])} to {Math.round(breaks[i])}</div>);
        }

        map.current.setPaintProperty(layerName, 'fill-color', style);
        const colorInterpolator = (i) => {
            if(i < 0 || i > 10) {
                return "rgb(0,0,0)";
            }
            return colorScheme[i];
        }
        setColorScale([range, colorInterpolator, breaks]);
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
            <img id='menu-icon' className='top-left over-map' onClick={onMenuClick.bind(this)} src='/menu-squared-48.png' alt='Menu'></img>
            <nav id='menu' className={`top-left over-map`}>
                <div>
                    <div>
                        <label htmlFor="years">Select a base year:</label>
                        <select name="years" id="years" onChange={onYearClick}>
                            {years}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="comparision-years">Select a comparision year:</label>
                        <select name="comparision-years" id="comparision-years" onChange={onComparisionYearClick}>
                            {comparisions_years}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="variables">Select a variable:</label>
                        <select name="variables" id="variables" onChange={onVariableClick}>
                            {variablesList}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="citie">Select a city:</label>
                        <select name="cities" id="cities" onChange={onCityClick}>
                            {citiesList}
                        </select>
                    </div>
                </div>
            </nav>
            <div id="emissions-legend" className={`legend ${showLegend ? undefined : 'hide'}`}>
                <h4>Emissions</h4>
                <h6 className='subheading'>(In Kilograms of CO₂)</h6>
                {emissionsLegend}
            </div>
        </div>
    );
}

export default Menu;
