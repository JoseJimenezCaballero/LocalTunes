import React from "react"
import FrontPageHeader from './components/FrontPageHeader'
import FrontPageBody from './components/FrontPageBody'
import FrontPageFooter from './components/FrontPageFooter'
import ResultsHeader from './components/ResultsHeader'
import ArtistContainer from './components/ArtistContainer'
import Artist from './components/Artist'
import { sendLocationToAPI } from "./api"
import Loading from "./components/Loading"
import ErrorPageLocation from "./components/ErrorPageLocation"
import ErrorPageAPI from "./components/ErrorPageAPI"

export default function App(){
    const [frontPageActive, setFrontPageActive] = React.useState(true) //state for setting front page to the next page
    const [apiData, setApiData] = React.useState(undefined) //state used to let components know that data has been received from api and the data is stored here
    const [expandType, setExpandType] = React.useState(undefined) //state used to update the type of location will be used when the user wishes to expand location search
    const [geoLocationStatus, setGeoLocationStatus] = React.useState(true) //state used for updating the geolocation status and rendering components accordingly
    const [apiError, setApiError] = React.useState(false) //state used for updating the components that there was an error on the api retrieval

    //this effect is in charge of making the api call to the back end. it first gathers the coordinates and then sends them to the back end
    React.useEffect(() => { //will be triggered at load and when the user has chosen to expand the search
        if(navigator.geolocation){ //if we can get the location successfully

            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log("location sent")

                sendLocationToAPI(latitude, longitude, expandType)
                    .then(data=> { //data will contain our api data for artists and tracks
                        setApiData(data) //set the data to the api data state

                    },
                    (error) =>{
                        setApiError(true)//on an error we update the apierror state and render the error page
                    }
                
                )
            
            },
            (error) =>{//on an error update the state to handle the rendering of error page
                setGeoLocationStatus(false)
            }
            
            )

        }

    }, [expandType])

    let artistElements//will hold the artists components
    let locations //locations will hold all the locations returned by api and what type of location ultimatley was used

    //if we have the apiData then we execute the following function to create the artists components
    if(apiData){
        let artists = apiData.data.artists
        locations = {"city": apiData.city, "state": apiData.state, "country": apiData.country, "locationUsed": apiData.data.type}//we update the location var to be an object with all the locations
        
        artistElements = artists.map(artist => { //map and make artist components with their appropiate props
            return(
                <Artist 
                    artistName={artist.artist.Name} 
                    artistImg={artist.artist.Image}
                    topSongs={artist.artist.TopSongs}
                    genre={artist.artist.Genre ? artist.artist.Genre[0] : false} //if there is no genre then set as false
                /> 
            )
        })
    }

    //this function handles the expanding on search when an user wants to expand the search. It takes the prev state and based on that will set the new state
    function handleExpandSearch(){
        setExpandType(prevType => {
            let typeChosen = prevType
            if(typeChosen === undefined){ //if the prevstate is still undefined then we update our variable
                typeChosen = locations.locationUsed
            }

            if(typeChosen === 'city'){ //if city then we erase the api data and return state
                setApiData(undefined)
                return 'state'
            }
            else if(typeChosen === 'state'){//similar
                setApiData(undefined)
                return 'country'
            }
        })
    }

    //function used to toggle the page from main to results onclick of a button
    function togglePage(){
        setFrontPageActive(prevState => !prevState)
    }
    

    //function used to choose which location to display and if its needed to let user know we expanded the search
    function chooseLocation(locations){
        let city = locations.city
        let state = locations.state
        let country = locations.country
        let usedLocation = locations.locationUsed

        if(usedLocation === "city"){
            return city
        }
        else if(usedLocation === "state"){
            return state
        }
        else{
            return country
        }
    }


    return( //if the frontPageActive state is false then that means the front page does not need to be displayed anymore
        <div>
            {geoLocationStatus && frontPageActive && <FrontPageHeader />}
            {geoLocationStatus && frontPageActive && <FrontPageBody toggle={togglePage}/>} 
            {geoLocationStatus && frontPageActive && <FrontPageFooter />}

            {!geoLocationStatus && <ErrorPageLocation />}
            {apiError && <ErrorPageAPI />}

            {!apiError && !frontPageActive && !apiData && <Loading />}
            {!frontPageActive && apiData && <ResultsHeader location={chooseLocation(locations)} locations={locations} expandType={expandType}/>}
            {!frontPageActive && apiData && <ArtistContainer artists={artistElements} type={locations.locationUsed} onClick={handleExpandSearch}/>}

        </div>
    )

}

