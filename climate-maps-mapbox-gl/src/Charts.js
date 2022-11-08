import React from 'react';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import lr_models from './lr_models.json'
export function drawChart(height, width, data, variableX, variableY, city, svgCache, year, comparision_year, colorscheme, computed_regressions) {
    let year_data = [];
    let renderCircles = false;
    let years = [year];
    const columns = ['WHITE', 'TOTAL', 'TRANSPORT', 'FOOD', 'HOUSING', 'GOODS', 'SERVICE']
    const tableData = []
    if (comparision_year != '-') {
        years.push(comparision_year);
    }

    if (city) {
        data.forEach(row => {
            row['Year'] = year;
            year_data.push(row);
            const tableRow = { 'Year': year, 'GEOID': row['GEOID'] }
            columns.forEach(col => tableRow[col] = row[year + '_' + col])
            tableData.push(tableRow);
        });
        if (comparision_year != '-') {
            data[comparision_year].columns.push('Year');
            data[comparision_year].forEach(row => {
                row['Year'] = comparision_year;
                year_data.push(row);
                const tableRow = { 'Year': comparision_year, 'GEOID': row['GEOID'] }
                columns.forEach(col => tableRow[col] = row[year + '_' + col])
                tableData.push(tableRow);
            });
        }
        data.columns.push('Year');
        // data = data.filter(row => row['CITYNAME'] == city);
        showTable(tableData);
        d3.select('#charts-title').html('% White vs Emissions in ' + city.split(',')[0] + ' Kilograms CO₂');
        d3.select('#table-title').html('Data for ' + city);
        renderCircles = true;
    } else {
        // const comparision_year_data = comparision_year != '-' ? data[comparision_year] : [];
        // year_data = [...data[year].map(row => { row['Year'] = year; return row; }), ...comparision_year_data.map(row => { row['Year'] = comparision_year; return row; })];
        d3.select('#charts-title').html('% White vs Emissions in US (Kilograms CO₂)');
        d3.select('#table-title').html('Select a city to show Table');
    }
    let cachedChart = svgCache[variableX + variableY + city + year + comparision_year];
    let chartContainer = document.getElementById('white-variable');
    d3.selectAll(`.circle-selected`).classed("circle-selected", false);

    chartContainer.replaceChildren();
    if (cachedChart) {
        chartContainer.replaceChildren();
        chartContainer.append(cachedChart);
    } else {
        const chart = Scatterplot(year_data, {
            x: d => Number(d[year + '_' + variableX]),
            y: d => Number(d[year + '_' + variableY]),
            title: d => '',
            xLabel: `% ${variableX}`,
            yLabel: variableY + ' (Kilograms CO₂)',
            stroke: "#333",
            width,
            height,
            fill: "white",
            variableX,
            variableY,
            renderCircles,
            years,
            colorscheme: colorscheme,
            computed_regressions,
            city
        })

        chartContainer.append(chart)
        svgCache[variableX + variableY + city + year + comparision_year] = chart;
    }
}

function showTable(data) {
    if (!data && !data[0]) {
        return;
    }
    const emissionsFormat = d3.format('.4s')
    const percentFormat = d3.format('.2%')
    const columns = ['GEOID', 'Year', 'WHITE', 'TOTAL', 'TRANSPORT', 'FOOD', 'HOUSING', 'GOODS', 'SERVICE']
    const existing = d3.select('table');
    if (existing) {
        existing.remove()
    }
    let container = d3.select('#emissions-table')
    let table = container.append("table").classed("table", true);

    let thead = table.append("thead");
    let tbody = table.append("tbody");
    let th = thead.append('tr').selectAll('th').data(columns).enter().append('th').text(c => c);

    let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    rows.selectAll("td")
        .data((row) => columns.map((column) => { return { value: row[column] } }))
        .enter()
        .append("td")
        .text(function (d, i) {
            if (i <= 1) {
                return d.value;
            }
            if (i == 2) {
                return percentFormat(d.value)
            }
            return emissionsFormat(d.value)
        });

    th.on("click", function (e, d) {
        //console.log(d)
        //d3.select(this).classed("selected-th", d3.select(this).classed("selected-th"))
        rows.sort(function (b, a) {
            if (a[d] < b[d]) {
                return -1;
            }
            if (a[d] > b[d]) {
                return 1;
            }
        })
        return 0;
    })
}

function Charts({ variable, colorScale, hoveredTract, city, setCsv, year, comparision_year }) {
    //console.log('Hey', { variable, hoveredTract, city, setCsv, year, comparision_year })
    const renderedVariable = useRef(null);
    const renderedCity = useRef(null);
    const computed_regressions = useRef(lr_models)
    const highlightedHoveredTract = useRef(null);
    const fetchedYears = useRef(new Set());
    const cities = useRef(['Atlanta, GA', 'Los Angeles--Long Beach--Anaheim, CA', 'St. Louis, MO--IL', 'Denver--Aurora, CO', 'Chicago, IL--IN', 'Cincinnati, OH--KY--IN',
        'Dallas--Fort Worth--Arlington, TX', 'Cleveland, OH', 'Boston, MA--NH--RI', 'Houston, TX', 'Minneapolis--St. Paul, MN--WI',
        'Philadelphia, PA--NJ--DE--MD', 'Portland, OR--WA']);    //console.log(city)
    if (variable == null)
        variable = 'FOOD';
    const isInitialRender = useRef(true);
    let emissionsData = useRef(null);
    const svgCache = useRef({});
    // const [data, setData] = useState([]);
    const renderedCharts = false;
    const colorscheme = colorScale
    //console.log('variable ', variable)
    //console.log(hoveredTract)

    useEffect(() => {
        if (isInitialRender.current) {
            emissionsData.current = {};
        }

        if (city && !fetchedYears.current.has(city)) {
            isInitialRender.current = false;
            let cityState = city.split(',')
            if (cityState && cityState[0]) {
                d3.csv(`${process.env.REACT_APP_BASE_URL}/data/chart_data/city_data/` + cityState[0] + `.csv`).then((data) => {
                    isInitialRender.current = false;
                    console.log(data)
                    emissionsData.current[cityState[0]] = data
                    // emissionsData.current = data;
                    setCsv(emissionsData.current);
                    if (variable) {
                        renderedVariable.current = variable;
                        if (city) {
                            renderedCity.city = city;
                        }
                        drawChart(400, 700, data, 'WHITE', variable, city, svgCache.current, year, comparision_year, colorscheme, computed_regressions);
                    }
                });
            }
        } else {
            if ((renderedVariable.current != variable || renderedCity.current != city) && emissionsData.current) {
                renderedVariable.current = variable;
                renderedCity.current = city;
                drawChart(400, 700, emissionsData.current, 'WHITE', variable, city, svgCache.current, year, comparision_year, colorscheme, computed_regressions);
            }
        }


    }, [variable, city, year, comparision_year]);

    useEffect(() => {
        if (hoveredTract && highlightedHoveredTract.current != hoveredTract) {
            const highlighted = d3.selectAll(`.circle-${highlightedHoveredTract.current}`);
            if (highlighted)
                highlighted.classed("circle-selected", false);
            d3.selectAll(`.circle-${hoveredTract}`).classed("circle-selected", true).raise();
            highlightedHoveredTract.current = hoveredTract;
        }
    }, [hoveredTract])

    return (
        <div className="Charts over-map bottom-center">
            <div id="chart">
            </div>
        </div>
        /* <div id="white-variable" className="col-6">
          <h2>Chart1</h2>
        </div>
        <div className="col-6">
          <h2>Chart2</h2>
        </div> */
    );

}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/scatterplot
function Scatterplot(data, {
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    r = 3, // (fixed) radius of dots, in pixels
    title, // given d in data, returns the title
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = r * 2, // inset the default range, in pixels
    insetTop = inset, // inset the default y-range
    insetRight = inset, // inset the default x-range
    insetBottom = inset, // inset the default y-range
    insetLeft = inset, // inset the default x-range
    width = 640, // outer width, in pixels
    height = 500, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    fill = "none", // fill color for dots
    stroke = "currentColor", // stroke color for the dots
    strokeWidth = 1.5, // stroke width for dots
    halo = "#fff", // color of label halo 
    haloWidth = 3, // padding around the labels,
    variableX,
    variableY,
    renderCircles,
    years,
    colorscheme = undefined,
    computed_regressions,
    city
} = {}) {
    // Compute values.
    // data = data.filter(d => isFinite(d));
    let X = [];//d3.map(data, x);
    // X = X.filter(i => isFinite(i));
    let Y = [];//d3.map(data, y);
    // Y = Y.filter(i => isFinite(i));
    // let dataByYear = {};
    // let linedata = [];
    // let lineDataByYear = {};
    // let lrByYear = {};
    let computed_lr;
    const lr_key = city ? city : 'all';
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height - (marginBottom + marginTop))
        .attr("width", width - (marginLeft + marginRight))
        .style("fill", "#ddd")

    years.forEach(year => {
        computed_lr = computed_regressions.current[year][lr_key][variableY][variableX]
        X.push(computed_lr.x_ext[0]);
        X.push(computed_lr.x_ext[1]);
        Y.push(computed_lr.y_ext[1]);
        Y.push(computed_lr.y_ext[0]);
        Y.sort();
        X.sort();
    });
    // years.forEach(y => {
    //     dataByYear[y] = { X: [], Y: [] }
    //     lineDataByYear[y] = []
    // });

    // data.forEach((row) => {
    //     const x_row = x(row);
    //     const y_row = y(row);
    //     if (isFinite(x_row) && isFinite(y_row)) {
    //         const current_year = row['Year'];
    //         X.push(x_row);
    //         Y.push(y_row);

    //         dataByYear[current_year]['X'].push(x_row);
    //         dataByYear[current_year]['Y'].push(y_row);
    //     };
    // });

    // Object.keys(lineDataByYear).forEach((value) => {
    //     lrByYear[value] = linearRegression(dataByYear[value]['Y'], dataByYear[value]['X']);
    // })
    // let X_year = X.filter(i => i['Year'] == year);
    // let Y_year = Y.filter(i => i['Year'] == year);

    // data.forEach((row) => {
    //     let lineDot = {};
    //     const x_row = x(row);
    //     const y_row = y(row);
    //     if (isFinite(x_row) && isFinite(y_row)) {
    //         const current_year = row['Year'];
    //         lineDot[variableX] = x_row;
    //         lineDot[variableY] = (x_row * lrByYear[current_year].slope) + lrByYear[current_year].intercept;
    //         lineDataByYear[current_year].push(lineDot);
    //     }
    // });

    // let line = d3.line()
    //     .x(function (d) { return xScale(d[variableX]); })
    //     .y(function (d) { return yScale(d[variableY]); });



    const T = title == null ? null : '';
    const I = d3.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = d3.extent(Y);

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);


    // years.forEach(y => {
    //     const linedata = lineDataByYear[y];
    //     svg.append("path")
    //         .datum(linedata)
    //         .attr("class", "regression")
    //         .attr("d", line);
    // });



    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", marginTop + marginBottom - height)
            .attr("stroke-opacity", 0.5))
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    if (T) svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("text")
        .data(I)
        .join("text")
        .attr("dx", 7)
        .attr("dy", "0.35em")
        .attr("x", i => xScale(X[i]))
        .attr("y", i => yScale(Y[i]))
        .text(i => T[i])
        .call(text => text.clone(true))
        .attr("fill", "none")
        .attr("stroke", halo)
        .attr("stroke-width", haloWidth);

    if (renderCircles) {
        let arrowData = {}

        data.forEach(function (d) {
            if (arrowData[d.GEOID] == undefined) {
                arrowData[d.GEOID] = [{ 'x': x(d), 'y': y(d), 'id': d.GEOID }];
            }
            else {
                arrowData[d.GEOID].push({ 'x': x(d), 'y': y(d), 'id': d.GEOID })
            }
        })

        if (years.length == 2) {
            Object.keys(arrowData).forEach(function (k) {
                if (arrowData[k].length < 2) {
                    delete arrowData[k];
                }
            })

            let arrowLine = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));
            let cScale = d3.scaleLinear().domain([1, 1]).range([1, 1])
            let colorS = d3.interpolateGreys;
            if (colorscheme != undefined) {
                colorS = colorscheme[1];
            }

            svg.append("defs").selectAll("marker")
                .data(['thing'])
                .join("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 8)
                .attr("orient", "auto")
                .append("path")
                .attr("fill", "black")
                .style("fill-opacity", '.5')
                .attr("d", 'M0,-5L10,0L0,5');

            svg.append("g", "arrow-group")
                .selectAll(".chart-arrow")
                .data(Object.keys(arrowData))
                .enter()
                .append("path")
                .attr("d", function (d) {
                    if (arrowData[d].length == 2) {
                        return arrowLine(arrowData[d])
                    }
                })
                .attr("stroke", function (d) {
                    var i = 0;
                    while (arrowData[d][1].y - arrowData[d][0].y > colorscheme[2][i]) {
                        i++;
                    }

                    return colorS(i)
                })
                .attr("stroke-opacity", .7)
                .attr('marker-end', 'url(#arrow)')
                .attr("class", d => 'circle-' + arrowData[d][0].id)
                .on("mouseover", function (e, d) {
                    d3.select(this).classed("circle-selected", true)
                })
                .on("mouseout", function (e, d) {
                    d3.select(this).classed("circle-selected", false)
                })
                .append("title").text(function (d) {
                    return arrowData[d][1].y + ", " + arrowData[d][0].y + "\n" + arrowData[d][1].x + ", " + arrowData[d][0].x;
                })

        }
        else {
            svg.append("g")
                .attr("class", "circle-group")
                .selectAll("circle")
                .data(Object.keys(arrowData))
                .join("circle")
                .attr("fill", fill)
                .attr("fill-opacity", 0.5)
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)

                .attr("cx", d => xScale(arrowData[d][0].x))
                .attr("cy", d => yScale(arrowData[d][0].y))
                .attr("r", r)
                .attr("class", d => 'circle-' + arrowData[d][0].id);
        }

    }
    // let defined;
    // if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    
    svg.append('line')
        .style('stroke', 'black')
        .attr('x1', X[0])
        .attr('y1', computed_lr.slope * X[0] + computed_lr.intercept)
        .attr('x2', X[1])
        .attr('y2', computed_lr.slope * X[1] + computed_lr.intercept);
    return svg.node();
}

function linearRegression(y, x) {
    let linearReg = {};
    let n = y.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;

    for (let i = 0; i < y.length; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    linearReg['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    linearReg['intercept'] = (sum_y - linearReg.slope * sum_x) / n;
    linearReg['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return linearReg;
};

export default Charts;