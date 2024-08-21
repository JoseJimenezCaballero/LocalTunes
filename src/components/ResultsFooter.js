import React from "react"

//this is the footer for the result page, it will contain the button asking user to expand the search if they want
export default function ResultsFooter({onClick}){

    return(
        <div className="resultsFooter--container">
            <h3>Not enough artists?</h3>
            <h4>Try expanding your search area..</h4>
            <button onClick={()=>{
                onClick()
                }}>Expand</button>
        </div>
    )
}