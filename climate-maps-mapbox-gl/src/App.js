import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import Map from './Map.js';
import Methods from './Methods.js';
import About from './About.js';
import Home from './Home.js'
function App() {
  return (
    <div>
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light"
        >
          <div id="nav-content">
            <span id="nav-title">
              <h1>Historical CO2 Emissions</h1>
              
            </span>
            <span id="nav-links">
              <ul className="navbar-nav mr-auto ">
                <li className='nav-item active'> <NavLink className='nav-link' to="/">Home</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="/map">Map</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="/methods">Methods</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="About">About us</NavLink></li>
              </ul>
            </span>
            
          </div>
          <p align='right' className="last-updated-date">Last updated 05 January 2023</p>
        </nav>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="map" element={<Map />} />
          <Route path="methods" element={<Methods />} />
          <Route path="about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;