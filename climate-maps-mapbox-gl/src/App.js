import './App.css';
import React from 'react';
import { Routes, Route, MemoryRouter, NavLink } from "react-router-dom";
import Map from './Map.js';
import Methods from './Methods.js';
import About from './About.js';
import Home from './Home.js'
//import Chart from './Charts';
function App() {
  return (
    <div>
      <MemoryRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light"
        >
          <div id="nav-content">
            <span id="nav-title">
              <h1>Historical CO2 Emissions</h1>
              <p>decanal CO2 emissions across different sources, by census tract</p>
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
        </nav>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="map" element={<Map />} />
          <Route path="methods" element={<Methods />} />
          <Route path="about" element={<About />} />
        </Routes>
      </MemoryRouter >
    </div>
  );
}

export default App;