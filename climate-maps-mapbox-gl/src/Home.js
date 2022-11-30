import {
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom";

export default function Home() {
    let navigate = useNavigate();

    return (
        <div className="home-content">
            <h1>
                What’s your carbon footprint?
            </h1>
            <p>
                This is the question many Americans have been asking themselves for the past two decades, as we try to address the causes of human-induced climate change, particularly our consumption of fossil fuels.

                Recently, activists and experts have begun highlighting how not all carbon footprints are created equal. The biggest sources of greenhouse gas are on the production side, particularly agriculture and heavy industry. But consumer “footprints” vary widely as well.
            </p>
            <p>
                This website is a tool for you to see what the carbon footprint is in your community, and how that has changed over time. We also included demographic information, particularly family income, race and ethnicity, to help you consider how social factors shape our carbon consumption.
            </p>
            <p>
                This project is sponsored by the University of Cincinnati Digital Scholarship Center. Go here for a detailed discussion of our methodology. For an introduction to our team, go <a href="#" onClick={() => { navigate('/about'); return false }}>here</a>.
            </p>
            <hr></hr>
            <h1>How to Use This Site  </h1>
            <p>
            The goal of this project is to examine metropolitan level carbon dioxide use over time, and see connections to race and other demographic factors. This requires ALOT of data, and to start we have visualized it in two different ways.  
            </p>
            <h3><i>The Map</i></h3>
            <p>1. Select which sort of household emissions you want to see: Food, Housing, Transport, Goods, Services or Total.  </p>
            <p>2. Select a base year: 1980, 1990, 2000, 2010 or 2018.  </p>
            <p>3. Select a comparison year.  </p>
            <p>4. Select a city.    </p>
            <p>The map should automatically render and zoom in on the chosen city. Once you are on that city, you can change the emission categories and comparison years.  
Arrow Chart  </p>
<h3><i>Arrow Chart</i></h3>
<p>After a city renders, on the right you will see a chart that diagrams each census tract (2010 standard) in that metropolitan area. The left axis is metric tons of CO2/household in that tract, and the bottom is the percentage of residents who identify as White in that tract.  </p>
<p>For each tract we created a separate trend line to see if emissions were increasing or decreasing over the selected time span, and if there was demographic change. Specifically, was the tract becoming more of less White and using more or less CO2?  </p>
<p>The site is most instructive when you use the map and chart together.  </p>   

<ul>
  <li>Zoom in on the part of a city or metropolitan region you are interested in.  </li>
  <li>As you click on each census tract, you can see the demographic and emissions change by the number, and the appropriate arrow is highlighted on the chart.  </li>
</ul>
<p>Please Note: There might be some “lag” in the rendering of the Arrow Chart as the site is processing a significant amount of data. We are still working to make this as smooth as possible.  
 </p>   

 <h3><i>Full Data</i></h3>
 <p>On the bottom right is the full data set for each rendering. Each census tract has a “GEOID” number.  We know is not very helpful in identifying a specific location. We are working on linking this data to the map to make this section more usable.  </p>  
 <hr></hr>
 <h1>FAQ</h1>
 <p><b>Why is there only full rendering and data for thirteen cities? </b></p>   
 <p>These were the cities chosen for the first stage of this project, and we used them for our initial round of mapping and rendering. As we refine the site, we will be adding data sets for every major metropolitan area in the United States.   </p>       
<p><b>Why is White the only racial category?  </b></p>   
<p>Our initial goal with this project was to see if there was a historic connection between Whiteness and fossil fuel use. We found that the answer to this is much more complicated than we had initially suspected. But we wanted to keep this initial visualization to explore the correlation between race and carbon emissions over time.  

As we revise the site, we will add different visualizations for other racial categories.  </p> 

<p><b>It looks like emissions have decreased significantly over the past forty years? Isn’t that great news?  </b></p>   
<p>Yes and no. It depends on the category and city.  

Household level emissions are based on federal government consumption and travel surveys. These are the best standardized, national data sets available, but in some ways they are just a snapshot at a particular moment in time.  

Carbon emissions for most American households are still very high, especially compared to peer countries in the Western Europe or parts of Asia.  </p>
<p><b>When I initially look at a city, it’s all one color, with large blocks, but when I zoom in, there are a lot more districts with much different colors. Why?  </b></p>   
<p>In order to display all of the data effectively and efficiently, census tracts aregrouped together at the macro level. This does not effect the Arrow Chart for each city, which shows each census tract.  

Balancing detail and accuracy with a smoothly operating map is a challenge. We will continue to refine this over the coming weeks and months.  

For the best understanding of a city, we recommend zooming  </p>
</div >
    )
}