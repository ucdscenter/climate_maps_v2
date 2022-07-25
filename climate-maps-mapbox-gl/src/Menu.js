import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import emissions_range from './emissions_range.json';

function Menu({ show, map }) {

    const years = [<option key='2018' value='2018' id='2018' href='#' className='active'>2018</option>];
    let year = '2018';
    let variable = 'FOODHOME_LN';
    const isInitialRender = useRef(true);
    const variables = ['FOODHOME_LN', 'FOODAWAY', 'ALCBEV', 'OWNDWE',
        'RENTDWE', 'OTHLOD', 'UTIL', 'HOUSOP', 'HOUKEEP', 'HOUSEQ', 'APPR',
        'VEHPUR', 'GASOIL', 'OTHVEH', 'PUBTRAN', 'HEALTH', 'ENTER', 'PERCARE',
        'READING', 'EDUC', 'TABACC', 'MISCELL', 'CASHCON', 'PERINC', 'VMT',
        'VMT_CO2', 'FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL'];
    const emissionsRange = emissions_range;
    const variablesList = [];
    const getBackgroundColor = (color) => { return { "backgroundColor": color } };
    const [showLegend, setShowLegend] = useState(0);
    const [emissionsLegend, setEmissionsLegend] = useState([]);
    useEffect(() => {
        if (!show)
            return;
        if (isInitialRender.current) {
            isInitialRender.current = false;
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
        setPaintProperty(year, variable);
    };
    const onYearClick = (e) => {
        year = '2018' //e.target.value;

        setPaintProperty(year, variable);
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

    }
    for (let i = 1980; i <= 2020; i += 10) {
        years.push(<option key={i} value={i} id={i} href='#' className='active'>{i}</option>);
    }

    variables.forEach((variable, i) =>
        variablesList.push(<option key={variable} value={variable} id={i} href='#' className='active'>{variable}</option>));
    if (!show)
        return null;
    return (
        <div className={show ? undefined : 'hide'}>
            <img id='menu-icon' className='top-left over-map' onClick={onMenuClick.bind(this)} src='/menu-squared-48.png'></img>
            <nav id='menu' className={`top-left over-map`}>
                <div>
                    <div>
                        <label htmlFor="years">Select a year:</label>
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
