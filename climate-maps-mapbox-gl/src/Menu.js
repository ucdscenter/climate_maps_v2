import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import emissions_range from './emissions_range.json';

function Menu({ show, map, cityCordinates, setVariable, setCity }) {

    const years = [<option key='2018' value='2018' id='2018' href='#' className='active'>2018</option>];
    let year = '2018';
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
            setPaintProperty(year, variable)
    };
    const onVariableClick = (e) => {
        if (!map.current)
            return;

        variable = e.target.value;
        setVariable(variable);
        setPaintProperty(year, variable);
    };
    const onYearClick = (e) => {
        year = e.target.value;

        setPaintProperty(year, variable);
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
    const setPaintProperty = (year, variable) => {
        let emissionsLegend = [<div key="no-data"><span style={getBackgroundColor('#ffffff')}></span>No Data</div>];
        const [range, layerName] = [emissionsRange[year][variable], `${year}_emissions_fill`];
        const colorscale = [];
        for (let i = 0; i <= 10; i++) {
            colorscale.push(d3.interpolateGreys(i / 10));
        }
        const style = ['interpolate',
            ['linear'],
            ['get', variable],
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


    for (let i = 1980; i <= 2020; i += 10) {
        years.push(<option key={i} value={i} id={i} href='#' className='active'>{i}</option>);
    }

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
                        <label htmlFor="years">Select a comparision year:</label>
                        <select name="years" id="years" onChange={onYearClick}>
                            {years}
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
