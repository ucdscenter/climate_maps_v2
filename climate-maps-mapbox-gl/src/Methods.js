export default function Methods() {
    return (
        <div className="home-content">

             <h1 align="center">
                Methods
            </h1>

            <p>The following is a summary of our methods, data sources and some overall results. We will be publishing more detailed findings with methodology in the near future.  </p>
            <hr></hr>
            <h2>Calculation Methodology</h2>
            <p>This research estimates a consumption-based carbon dioxide emission for the United States from 1980 to 2018. This estimation includes carbon footprints from five consumption categories: food, housing, transportation, goods, and service in household level.  
                
            </p>
            <p>The calculation provides census tract level carbon footprint in kilogram CO2 emission for five years: 1980, 1990, 2000, 2010, and 2018.  </p>
            <p>
                The calculation uses econometrics modelling to estimate average household expenditure on different spending categories using Consumer Expenditure Survey data from from the United States Bureau of Labor Statistics and uses CEDA environmentally-extended input-output table to apply life cycle carbon emission factors to estimate CO2 emission by different spending categories. 
            </p>
            <p>
                The calculation also considers vehicle driving as a key factor of carbon emission and uses econometrics modelling to estimate average household vehicle mile traveled (VMT) using National Household Travel Survey and applied average light-duty vehicle fuel economy to measure census tract level average household CO2 emission by vehicle driving. 
            </p>
            <h3>Five Categories Descriptions</h3>
            <table className="table-methods">
                <thead>
                    <tr>
                    <td></td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <b>FOOD</b>
                    </td>
                    <td>
                        FOOD AT HOME
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        FOOD AWAY FROM HOME 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        ALCOHOLIC BEVERAGES 
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>HOUSING</b>
                    </td>
                    <td>
                        OWNED DWELLING 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        RENTED DWELLING 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        OTHER LODGING
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        UTILITY 
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>TRANSPORTATION</b>
                    </td>
                    <td>
                        VEHICLE DRIVING 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        VEHICLE PURCHASES
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        GASOLINE, OTHER FUELS, AND MOTOR OIL
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        OTHER VEHICLE EXPENSES 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        PUBLIC AND OTHER TRANSPORTATION 
                    </td>
                </tr>
                <tr>
                    <td>
                      <b>GOODS</b>  
                    </td>
                    <td>
                        APPAREL 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        READING
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        TOBACCO PRODUCTS AND SMOKING SUPPLIES 
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        HOUSEKEEPING SUPPLIES
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        HOUSEHOLD FURNISHINGS AND EQUIPMENT
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        MISCELLANEOUS
                    </td>
                </tr>

                <tr>
                    <td>
                        <b>SERVICES</b>
                    </td>
                    <td>
                        HEALTHCARE
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        ENTERTAINMENT
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        PERSONAL CARE PRODUCTS AND SERVICES
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        EDUCATION
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        CASH CONTRIBUTION
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        PERSONAL INSURANCE AND PENSION
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        HOUSEHOLD OPERATION
                    </td>
                </tr>



            </tbody>
            </table>
            <hr></hr>
            <h2>Data Resources</h2>
            <ul>
                <li><p>Consumer Expenditure Survey: https://www.bls.gov/cex/ </p></li>
                <li><p>National Household Travel Survey: https://nhts.ornl.gov </p></li>
                <li><p>American Household Survey: https://www.census.gov/programs-surveys/acs </p></li>
                <li><p>US Census Decennial Survey: https://www.socialexplorer.com/explore-tables </p></li>
                <li><p>CEDA – Comprehensive Environmental Data Archive: https://vitalmetrics.com/environmental-databases </p></li>
                <li><p>EPA Automotive Trends Report: https://www.epa.gov/automotive-trends </p></li>
            </ul>
            <hr></hr>
            <h2>Summary of Results</h2>
            <img src="/stacked-emission-bars.png" className='disp-image'></img>
            <ul>
                <li><p>The US average household carbon emission was increased between 1980 and 1990, while it decreased after 1990. </p></li>
                <li><p>Transportation is the largest CO2 emission factor among the five categories. The share of transportation decreased after 2000. </p></li>
                <li><p>Food is the second largest CO2 emission factor, but the average CO2 emission from food has been decreased over the study period. </p></li>
                <li><p>The carbon footprint mapping provides detailed geography of CO2 emission in the US</p></li>
            </ul>

            <h2>References</h2>
            <p>Jones, Christopher M (2020). “Consumption Based Greenhouse Gas Inventory of San Francisco from 1990 to 2015.” Berkeley Energy and Climate Institute.  

 </p>
        </div>
    )
}