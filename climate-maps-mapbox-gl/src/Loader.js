import React from "react";

export function Loader({ show }) {
    if (show) {
        return (
            <div>
                <div className="overlay">
                    <div id="loading-div">
                        <h5 align="left">Please allow a few seconds for the map to load</h5>
                        <img className='mt-5' src="/big-ajax-loader.gif" alt="loading"></img>
                    </div>
                </div>
            </div>)
    }
}