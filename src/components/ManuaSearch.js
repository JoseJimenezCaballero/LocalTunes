import React from "react"
import {motion} from 'framer-motion'
import { searchByInput } from "../api"

export default function ManualSearch({setApiData, setIsManual}){
    const [isClicked, setIsClicked] = React.useState(false)//state used to know if button has been clicked
    const [locationForm, setLocationForm] = React.useState('')//state used to keep track of input in the location form
    const [isLoading, setIsLoading] = React.useState(false)//state used to toggle loading animation or not
    const [errorMessage, setErrorMessage] = React.useState(false) //state used to toggle displaying error message

    function handleChange(event){//fucntion to handle event change within the input
        const {value} = event.target
        setLocationForm(value)
    }

    function handleSubmit(){//function to handle the submitting of the location
        setIsLoading(true) //set loading state as true which will render loading animation
        setIsClicked(false) //set the clicked dropdown as false which will hide dropdown
        setIsManual(true)//set manual state as true to let app know it is a manual search 
        searchByInput(locationForm)//call api 
            .then(data=> {
                if(!data ){
                    setErrorMessage(true)//if error set error satte as true to render error message
                }
                else{
                    setApiData(data) //otherwise update api data state
                }
            })
            .finally(() => {
                setIsLoading(false)//toggle off loading animation
            })
    }

    return(
        <div className="ManualSearch--container">
            {isLoading ? 
                <motion.div
                    className="ManualSearch--button" 
                    style={{color: "#00CFFF"}}
                    animate={{ rotate: 360}}
                    transition={{repeat: Infinity, duration: 0.4, ease: "linear"}}>

                        <i className="bi bi-globe2"></i>

                </motion.div> : 
                
                <button className="ManualSearch--button" onClick={() => {
                    setIsClicked(prevState => !prevState)
                    setErrorMessage(false)
                    setLocationForm('')
                }}
                    ><i className="bi bi-globe2"></i></button>

            }

            {errorMessage && <h4 className="ManualSearch--h4">The location you entered could not be found. Please double-check the spelling or try a nearby area.</h4>}

            {isClicked && <motion.label initial={{ opacity: 0, y: -44.5 }} animate={{ opacity:1, y: 0 }} exit={{ opacity: 0, y: -44.5}} transition={{ delay: 0.2 }}
            htmlFor="location" 
            className="ManualSearch--label">
                Search for a Location
            </motion.label>}

            {isClicked && 
            <div className="ManualSearch--container--inputandBtn">
                <motion.input 
                    initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: 0.25 }} 
                    className="ManualSearch--input" type="text" placeholder="City and Country" name="location" onChange={handleChange} value={locationForm}/> 

                <motion.button initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: 0.3 }} className="ManualSearch--submit" onClick={handleSubmit}>
                    <i className="bi bi-arrow-right"></i>
                </motion.button>
            </div>}

        </div>
    )
}