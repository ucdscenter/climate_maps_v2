import React from "react";

export function Loader({ show }) {
    if (show) {
        return (
            <div>
                <div class="overlay">
                    <div id="loading-div">
                        <img className='mt-5' src="/big-ajax-loader.gif" alt="loading"></img>
                    </div>
                </div>
            </div>)
    }
}