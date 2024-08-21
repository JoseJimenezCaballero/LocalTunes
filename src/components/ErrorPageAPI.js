import React from "react"

//error page specifically for network issues
export default function ErrorPageAPI(){
    return(
        <div className="errorPage--container--API">
            <h1>There was an error with your request</h1>
            <h4>Please try again later...</h4>
            <i className="bi bi-plugin"></i>        
            </div>
    )
}