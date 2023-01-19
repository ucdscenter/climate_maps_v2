import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import Map from './Map.js';
import Methods from './Methods.js';
import About from './About.js';
import Home from './Home.js'
import Faq from './Faq';
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
                <li className='nav-item active'> <NavLink className='nav-link' to="/">HOME</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="/map">MAP</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="/methods">METHODS</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="About">ABOUT US</NavLink></li>
                <li className='nav-item active'> <NavLink className='nav-link' to="/faq">FAQ</NavLink></li>
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
          <Route path="faq" element={<Faq />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;