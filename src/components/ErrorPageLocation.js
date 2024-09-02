import React from "react"
import { useMediaQuery } from 'react-responsive';

//error page specifically for geolocation issues
export default function ErrorPageLocation(){

    return(
        <div className="errorPage--container">
            <h1>Please allow LocalTunes to use your current location.</h1>
            <h4>We rely on location services to suggest artists...</h4>
            <i className="bi bi-geo-fill"></i>
        </div>
    )
}