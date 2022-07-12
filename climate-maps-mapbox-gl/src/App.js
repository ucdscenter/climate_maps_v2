import './App.css';
import React from 'react';
import Map from './Map';
//import Chart from './Charts';
function App() {
  return (
    <div class="container-flex">
    <div class="row">
    <div class="col-12 m-3">
      <h1>Historical CO2 Emissions</h1>
      <p>decanal CO2 emissions across different sources, by census tract</p>
      </div>
    </div>
    <div class="row">
      <div class="col-8 h-75">
      <Map></Map>
    </div>
      <div class="col-4">
       <div class="row">
          <div class="col-12">
              <h2>Other Charts</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
              <h2>Chart1</h2>
          </div>
          <div class="col-6">
              <h2>Chart2</h2>
          </div>
        </div>
        
      </div>

    </div>
    </div>
  );
}

export default App;