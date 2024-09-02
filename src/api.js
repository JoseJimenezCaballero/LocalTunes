//this seperate file is used to handle the api call to the api which converts geolocation to locations, and then to the back-end



export function sendLocationToAPI(latitude, longitude, preffered=undefined){
    const key = process.env.REACT_APP_KEY
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${key}&no_annotations=1`;
    console.log(latitude, longitude)

    return fetch(url)
        .then(response => response.json())//take the response and jsonify it function
        .then(data => {
            let components = data.results[0].components; //all the data retunred
            let city = components.city || components.town || components.village || components.hamlet; //we can collect the city from any of the previous options
            let state = components.state; //collect state
            let country = components.country; //collect country
            let preff = preffered

            return fetch('https://localtunesbackend.onrender.com/city_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'city': city,
                    'state': state,
                    'country': country,
                    'preffered': preff
                })
            })
            .then(response => response.json())
        })


}

//api call specifically for when the user wants to load more artists already cached
export function sendCacheToAPI(cachedArtists){

    return fetch('https://localtunesbackend.onrender.com/cached_post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'artists': cachedArtists
        })
    })
    .then(response => response.json())
}


// This function will be called when the user specifies the place to search manually
export function searchByInput(place, preffered = undefined) {
    const key = process.env.REACT_APP_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${key}&no_annotations=1`; // We query the API by location instead
    console.log(place);

    return fetch(url)
        .then(response => {

            return response.json();
            
        }) // Take the response and jsonify it

        .then(data => {
            if(data.results.length === 0){ //checks if no results found in the search
                return undefined
            }

            let components = data.results[0].components; // All the data returned
            let city = components.city || components.town || components.village || components.hamlet || components.county; // We can collect the city from any of the previous options
            let state = components.state; // Collect state
            let country = components.country; // Collect country
            let preff = preffered;

            return fetch('https://localtunesbackend.onrender.com/city_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    city: city,
                    state: state,
                    country: country,
                    preffered: preff,
                }),
            });
        })
        .then(response => {
            if(!response){
                return undefined
            }
            return response.json();
        })
}
