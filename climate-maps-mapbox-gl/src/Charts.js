import React, { Component }  from 'react';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
export function drawChart(height, width) {
    d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")
        .style("background-color", "white")
        .append("text")
        .attr("fill", "green")
        .attr("x", 10)
        .attr("y", 50)
        .text("Sample Visualizations")
}

function Charts(props) {
    const isInitialRender = useRef(true);
    // const [data, setData] = useState([]);
    const renderedCharts = false;
    useEffect(() => {
        console.log('firing')
        if (isInitialRender.current) {
            drawChart(70, 150);
            isInitialRender.current = false;
        }
    }, []);


    return (
        <div className="Charts over-map bottom-center">
            <div id="chart">
            </div>
        </div>
    );

}
export default Charts;