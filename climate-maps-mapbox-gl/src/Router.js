import { Routes, Route, MemoryRouter } from "react-router-dom";
import Map from './Map.js';
import Methods from './Methods.js';
import About from './About.js';
import Home from './Home.js'
import App from './App.js'

export default function Router() {
    return (
        <MemoryRouter>
            <Routes>
                <Route path="map" element={<Map />} />
                <Route path="methods" element={<Methods />} />
                <Route path="about" element={<About />} />
            </Routes>
        </MemoryRouter>
    )
}