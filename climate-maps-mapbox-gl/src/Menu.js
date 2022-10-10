import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import emissions_range from './emissions_range.json';
import { color } from 'd3';

function Menu({ show, map, cityCordinates, setVariable, setCity }) {
    const years = [];
    const comparisions_years = [[<option key='comparision-default' value='-' id='comparision-default' href='#' className='active'>-</option>]]
    let year = useRef('1980');
    let comparision_year = useRef('-')
    let variable = 'FOOD';
    const isInitialRender = useRef(true);

    const variables = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL'];
    const cities = ['-', 'Atlanta, GA', 'Boston, MA--NH--RI', 'Chicago, IL--IN', 'Cincinnati, OH--KY--IN',
        'Cleveland, OH', 'Dallas--Fort Worth--Arlington, TX', 'Denver--Aurora, CO', 'Houston, TX', 'Los Angeles--Long Beach--Anaheim, CA', 'Minneapolis--St. Paul, MN--WI',
        'Philadelphia, PA', 'Portland, OR--WA', 'St. Louis, MO--IL']
    const emissionsRange = emissions_range;
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
            setVariable(variable)
            setTimeout(() =>
                onMenuClick(), 1000);
        }
    });
    const onMenuClick = () => {
        if (map.current)
            setPaintProperty(year.current, comparision_year.current, variable)
    };
    const onVariableClick = (e) => {
        if (!map.current)
            return;

        variable = e.target.value;
        setVariable(variable);
        setPaintProperty(year.current, comparision_year.current, variable);
    };
    const onYearClick = (e) => {
        year.current = e.target.value;

        setPaintProperty(year.current, comparision_year.current, variable);
    };

    const onComparisionYearClick = (e) => {
        comparision_year.current = e.target.value;

        setPaintProperty(year.current, comparision_year.current, variable);
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
        let colorScheme = d3.interpolateGreys;
        let property_key = year + '-' + variable;
        let invertScheme = false;
        let colorscale = [];
        let [range, layerName] = [emissionsRange[property_key], `all_decades_emissions_fill`];

        if (comparision_year != '-' && comparision_year != year) {
            let base = Number(year);
            let comparision = Number(comparision_year);

            if (base > comparision) {
                const temp = base;
                base = comparision;
                comparision = temp;
                range.min *= -1;
                range.max *= -1;
            }

            year = base + '-' + comparision;
            property_key = year + '-' + variable;
            range = emissionsRange[property_key];
            // second year < first year
            if (range.min < 0 && range.max < 0) {
                colorScheme = d3.interpolateGreens;
            } else if (range.min > 0 && range.max > 0) {     // second year > first year
                colorScheme = d3.interpolateReds;
            } else {
                colorScheme = d3.interpolateRdYlGn;
                invertScheme = true;
            }
        }

        for (let i = 0; i <= 10; i++) {
            colorscale.push(colorScheme(i / 10));
        }

        if (invertScheme) {
            colorscale.reverse();
        }


        let emissionsLegend = [<div key="no-data"><span style={getBackgroundColor('#ffffff')}></span>No Data</div>];

        map.current.setFilter(layerName, ["has", property_key]);
        const style = [
            'interpolate',
            ['linear'],
            ['get', property_key],
            range.min,
            ['to-color', colorscale[0]]
        ];
        
        let i = 0;
        emissionsLegend.push(<div key={i++}><span style={getBackgroundColor(colorscale[0])}></span>{Math.round(range.min)}</div>)
        const steps = 10;
        const diff = range.max - range.min;
        const step = diff / 11;
        for (let value = range.min; i <= steps; i++) {
            value += step;
            style.push(value, ['to-color', colorscale[i]]);
            emissionsLegend.push(<div key={i}><span style={getBackgroundColor(colorscale[i])}></span>{Math.round(value)}</div>)
        }
        style.push(range.max, ['to-color', colorscale[10]]);
        emissionsLegend.push(<div key={++i}><span style={getBackgroundColor(colorscale[10])}></span>{Math.round(range.max)}</div>)
        map.current.setPaintProperty(layerName, 'fill-color', style);

        setEmissionsLegend(emissionsLegend);
        if (!showLegend) {
            setShowLegend(!showLegend);
        }

    }//setPaintProperty

    ['1980', '1990', '2000', '2010', '2018'].forEach(i => {
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
                {emissionsLegend}
            </div>
        </div>
    );
}

export default Menu;
