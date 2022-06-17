import './App.css';
import React, { useState } from 'react';

function Menu({ map }) {
    const years = [];
    const variables = [];
    const [showMenu, setShowMenu] = useState(0);
    // const [map, setMap] = useState();
    const onMenuClick = () => {
        setShowMenu(!showMenu)
        map.current.setPaintProperty('parcels-fill', 'fill-color', [
            'step',
            ['get', 'store'],
            '#51bbd6',
            1000,
            '#f1f075',
            2000,
            '#f28cb1'
        ]);
    };

    for (let i = 2010; i < 2022; i++) {
        years.push(<a key={i} id={i} href='#' className='active'>{i}</a>);
    }
    for (let i = 0; i < 5; i++) {
        variables.push(<a key={i} id={i} href='#' className='active'>{i}</a>)
    }
    return (
        <div>
            <img id='menu-icon' className='top-left over-map' onClick={onMenuClick.bind(this)} src='/menu-squared-48.png'></img>
            <nav id='menu' className={`top-left over-map ${showMenu ? undefined : 'hide'}`}>
                <div className="col-md-3">
                    <ul className="nav nav-pills nav-stacked over-map">
                        {/* <li className="active"><a href="#">Home</a></li> */}
                        <li>{years}</li>
                        <li>
                            {variables}</li>
                        {/* <li><a href="#">{charts}</a></li> */}
                    </ul>
                </div>


            </nav>
        </div>
    );
}

export default Menu;
