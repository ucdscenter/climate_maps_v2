export default function Faq() {
    return (
        <div className="home-content">
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
        </div>
    )
}