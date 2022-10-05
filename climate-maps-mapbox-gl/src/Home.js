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
        </div >
    )
}