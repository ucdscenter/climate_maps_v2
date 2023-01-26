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
            This is the question many Americans have been asking themselves for the past two decades, as we try to address the causes of human-induced climate change, particularly our consumption of fossil fuels. Recently, activists and experts have begun highlighting how not all carbon footprints are created equal. The biggest sources of greenhouse gas are on the production side, particularly agriculture and heavy industry. But consumer “footprints” vary widely as well, especially across our major cities. Some folks have smaller apartments and use public transportation, while others live in large suburban homes and drive hundreds of miles a week.  
            </p>
            <p>
                This website is a tool for you to see what the carbon footprint is in your community, and how that has changed over time. We also included demographic information, particularly family income, race and ethnicity, to help you consider how social factors shape our carbon consumption.
            </p>
            <p>
                This website is a tool for you to see the average household carbon usage in your community, and how that has changed over time. But we also wanted to consider how social and demographic factors shape carbon usage, especially race. We examined a number of variables in our research, but for this current version we show how the percentage of White residents in a given metropolitan community corresponds to household carbon use.             </p>
            <hr></hr>
            <h1>How to Use This Site  </h1>
            <p>
            The goal of this project is to examine metropolitan level carbon dioxidfe use over time, and see connections to race and other demographic factors. This requires a lot of data, and to start we have visualized it in two different ways.  
            </p>
            <h3><i>The Map</i></h3>
            <p>1. Select which sort of household emissions you want to see: Food, Housing, Transport, Goods, Services or Total.  </p>
            <p>2. Select a base year: 1980, 1990, 2000, 2010 or 2018.  </p>
            <p>3. Select a comparison year.  </p>
            <p>4. Select a city.    </p>
            <p>The map should automatically render and zoom in on the chosen city. Once you are on that city, you can change the emission categories and comparison years.</p>
<h3><i>Arrow Chart</i></h3>
<p>After a city renders, on the right you will see a chart that diagrams each census tract (2010 standard) in that metropolitan area. The left axis is metric tons of CO2/household in that tract, and the bottom is the percentage of residents who identify as White in that tract.  </p>
<p>For each tract we created a separate trend line to see if emissions were increasing or decreasing over the selected time span, and if there was demographic change. Specifically, was the tract becoming more or less White and using more or less CO2?  </p>
<p>The site is most instructive when you use the map and chart together.  </p>   

<ul>
  <li>Zoom in on the part of a city or metropolitan region you are interested in.  </li>
  <li>As you click on each census tract, you can see the demographic and emissions change by the number, and the appropriate arrow is highlighted on the chart.  </li>
</ul>
<p>Please Note: This is a prototype, please be patient while the map renders and as the site is processing a significant amount of data. We are still working to make this as smooth as possible.  
 </p>   

 <h3><i>Full Data</i></h3>
 <p>On the bottom right is the full data set for each rendering. Each census tract has a “GEOID” number.  We know is not very helpful in identifying a specific location. We are working on linking this data to the map to make this section more usable.  </p>  
 <hr></hr>

 <h5>Feedback? </h5>
 <p>Email any feedback or specific questions and requests to gioielr@ucmail.uc.edu</p>
</div >
    )
}