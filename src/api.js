//this seperate file is used to handle the api call to the api which converts geolocation to locations, and then to the back-end



export function sendLocationToAPI(latitude, longitude, preffered=undefined){
    const key = process.env.REACT_APP_KEY
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${key}`;

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


