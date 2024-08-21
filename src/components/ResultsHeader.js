import React from "react"

//this component holds the results header which will display the location of search and wheteher or not we needed to expand the search for the user 
export default function ResultsHeader({location , locations, expandType}){
    let locationUsed = locations.locationUsed

    return(
        <div className="results--header">
            <h1 className="results--h1">{location}</h1>
            {!expandType && locationUsed === 'city' && <p className="results--p">Here are some artists or bands from {location} we think you might like.. </p>}
            {!expandType && locationUsed != 'city' && <p className="results--p">We were unable to find artists or bands from {locations.city} so we expanded your search...</p>}
            {expandType && <p className="results--p">Here are some artists or bands from {location} we think you might like.. </p>}
        </div>
    )
}