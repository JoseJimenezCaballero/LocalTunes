import React from "react"

//this component is the component which genres are generated into, they are buttons
export default function GenreButton({genre, onClick, toggleDropdown}){
     
    return(
        <div >
            <button className="genreButton" onClick={() => {onClick(genre); toggleDropdown();}}>{genre ? genre : "No Genre"}</button>
        </div>
    )
}