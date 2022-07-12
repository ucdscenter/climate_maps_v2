import './App.css';
import React, { useState } from 'react';
import * as d3 from 'd3';
import emissions_range from './emissions_range.json';

function Menu({ map }) {
    const years = [<option value='2018' id='2018' href='#' className='active'>2018</option>];
    let year = '2018';
    let variable = 'TOTAL';
    const variables = ['FOODHOME_LN', 'FOODAWAY', 'ALCBEV', 'OWNDWE',
        'RENTDWE', 'OTHLOD', 'UTIL', 'HOUSOP', 'HOUKEEP', 'HOUSEQ', 'APPR',
        'VEHPUR', 'GASOIL', 'OTHVEH', 'PUBTRAN', 'HEALTH', 'ENTER', 'PERCARE',
        'READING', 'EDUC', 'TABACC', 'MISCELL', 'CASHCON', 'PERINC', 'VMT',
        'VMT_CO2', 'FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL'];
    const emissionsRange = emissions_range;
    console.log(emissionsRange);
    const variablesList = [];
    const getBackgroundColor = (color) => { return { "backgroundColor": color } };
    const [showMenu, setShowMenu] = useState(0);
    const [emissionsLegend, setEmissionsLegend] = useState([]);
    const onMenuClick = () => {
        setShowMenu(!showMenu)
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
        console.log(year)
    };

    const setPaintProperty = (year, variable) => {
        let emissionsLegend = [<div><span style={getBackgroundColor('#ffffff')}></span>No Data</div>];
        const [range, layerName] = [emissionsRange[year][variable], `${year}_emissions_fill`];
        const colorscale = [];
        for (let i = 0; i <= 10; i++) {
            colorscale.push(d3.interpolateReds(i / 10));
        }
        const style = ['interpolate',
            ['linear'],
            ['get', variable],
            range.min,
            ['to-color', colorscale[0]]
        ];
        emissionsLegend.push(<div><span style={getBackgroundColor(colorscale[0])}></span>{Math.round(range.min)}</div>)
        const steps = 10;
        const diff = range.max - range.min;
        const step = diff / 11;
        for (let i = 1, value = range.min; i <= steps; i++) {
            value += step;
            style.push(value, ['to-color', colorscale[i]]);
            emissionsLegend.push(<div><span style={getBackgroundColor(colorscale[i])}></span>{Math.round(value)}</div>)
        }
        style.push(range.max, ['to-color', colorscale[10]]);
        emissionsLegend.push(<div><span style={getBackgroundColor(colorscale[10])}></span>{Math.round(range.max)}</div>)
        map.current.setPaintProperty(layerName, 'fill-color', style);
        setEmissionsLegend(emissionsLegend);

    }
    for (let i = 1980; i <= 2020; i += 10) {
        years.push(<option value={i} id={i} href='#' className='active'>{i}</option>);
    }

    variables.forEach((variable, i) =>
        variablesList.push(<option value={variable} id={i} href='#' className='active'>{variable}</option>));

    return (
        <div>
            <img id='menu-icon' className='top-left over-map' onClick={onMenuClick.bind(this)} src='/menu-squared-48.png'></img>
            <nav id='menu' className={`top-left over-map ${showMenu ? undefined : 'hide'}`}>
                <div>
                    <div>
                        <label htmlFor="variables">Select a year:</label>
                        <select name="variables" id="years" onClick={onYearClick}>
                            {years}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="variables">Select a variable:</label>
                        <select name="variables" id="variables" onClick={onVariableClick}>
                            {variablesList}
                        </select>
                    </div>
                </div>
            </nav>
            <div id="emissions-legend" className={`legend ${showMenu ? undefined : 'hide'}`}>
                <h4>Emissions</h4>
                {emissionsLegend}
            </div>
        </div>
    );
}

export default Menu;
