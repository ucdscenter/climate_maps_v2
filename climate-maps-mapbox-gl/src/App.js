import './App.css';
import React from 'react';
import Map from './Map';
//import Chart from './Charts';
function App() {
  return (
    <div className="container-flex">
    <div className="row">
    <div className="col-12 m-3">
      <h1>Historical CO2 Emissions</h1>
      <p>decanal CO2 emissions across different sources, by census tract</p>
      </div>
    </div>
    <div className="row">
      <div className="col-8 h-75">
      <Map></Map>
    </div>
      <div className="col-4">
       <div className="row">
          <div className="col-12">
              <h2>Other Charts</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
              <h2>Chart1</h2>
          </div>
          <div className="col-6">
              <h2>Chart2</h2>
          </div>
        </div>
        
      </div>

    </div>
    </div>
  );
}

export default App;