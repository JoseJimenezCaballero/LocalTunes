from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin #libraries used for cors headers
import random
from waitress import serve #used to serve our app
import musicbrainzngs #library used to gather artists based on city
import json
import aiohttp
import asyncio
import base64
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env


client_id = os.getenv("CLIENT_ID") #get credentials from .env file
client_secret = os.getenv("CLIENT_SECRET")

#this function is used to get access token for the spotify api
async def get_spotify_access_token():
    auth_str = f"{client_id}:{client_secret}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_str}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "client_credentials"
    }

    async with aiohttp.ClientSession() as session:
        async with session.post("https://accounts.spotify.com/api/token", headers=headers, data=data) as resp:
            response_data = await resp.json()

            return response_data['access_token']



app = Flask(__name__) #init Flask object into app var
CORS(app) #makes our app CORS capable so that browsers allow scripting api calls

musicbrainzngs.set_useragent("LocalTunes", "0.95", "djnano99@live.com")#we need to set user to use the library


#function used to get artists based on location, it will take a string for the location(city) and return an array of artist objects limited to 5

#function to get top tracks of specified artists from spotify using spotipy API
async def get_artist_top_tracks(session, access_token, artist_name):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Search for the artist
    async with session.get(f"https://api.spotify.com/v1/search?q=artist:{artist_name}&type=artist&limit=3", headers=headers) as resp:
        if resp.status != 200:
            print(f"Error: Received status code {resp.status}")
            text = await resp.text()
            print(f"Response text: {text}")
            return None, None, None 

        # Check if content-type is JSON
        content_type = resp.headers.get('Content-Type', '').lower()
        if 'application/json' not in content_type:
            print(f"Unexpected Content-Type: {content_type}")
            text = await resp.text()  # Read as text if it's not JSON
            print(f"Response text: {text}")
            return None, None, None 
        
        try:
            search_results = await resp.json()
            items = search_results['artists']['items']


        except:
            text = await resp.text()
            print(f"Failed to decode JSON. Response text: {text}")
            return None, None, None 
            
    #check if artist info isn't empty
    if len(items) > 0:
        for item in items:
            if item['name'].lower() == artist_name.lower(): # to ensure it searches for the exact artist name
                artist_id = item['id'] # obtain artist id
                img = item['images'][0]['url'] if item['images'] else None #get the artist image if there is one, else return None
                break
        else:
            return None, None, None #have to return 3 values for the tuple

        genre = items[0]["genres"] #get artist genre (there can be more than 1, get the first)
        

        while True:
            # Get the artist's top tracks
            async with session.get(f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?market=US", headers=headers) as resp:
                if resp.status == 429:
                    retry_after = int(resp.headers.get('Retry-After', 1))
                    print(f"Rate limit exceeded. Retrying in {retry_after} seconds.")
                    await asyncio.sleep(retry_after)
                    print("after sleep")
                    continue  # Retry the request
                
                if resp.status != 200:
                    print(f"Error: Received status code {resp.status}")
                    text = await resp.text()
                    print(f"Response text: {text}")
                    return None, None, None
                
            
                results = await resp.json()
                tracks = results.get('tracks')
                break

        arr2 = [] #make array with format “TopSongs”: [{songName: ”Track”, albumCover:”url”….},{},{}…] 
        for track in tracks[:3]: #get only top 3 tracks
            link = {
                'SongName': track['name'], # might not be needed anymore, song name can't be key
                'UrlToSong': track['external_urls']['spotify'], #spotify link
                'AlbumCover': track['album']['images'][0]['url'], #album cover image url
                'ReleaseYear': track['album']['release_date'][:4] #release date
            }
            arr2.append(link) # append top song dictionary into an array

        if not arr2: # check if array is empty and return appropriate values
            return None, None, None

        return arr2, img, genre #returns array containg top song info, artist image, and genre

    return None, None, None #if artist not found


#this function utilizes the musicbrainz library to gather artists based on the chosen location. A preffered argument is passed if the user would rather choose a particular location instead of us
def getArtists(city, state, country, preffered=None):
    artists = {'artists': []}#an object which will contain two keys, one for the type meaning city, state, country and one for the array of artists
    offset = 0
    limit = 200

    if(preffered == None or preffered == 'city'):#if the user made a choice to expand the search then it will automatically not search for the city
        while(offset < limit):
            result = musicbrainzngs.search_artists(area=city, offset=offset, limit=limit)
            for n in range(len(result.get('artist-list'))):
                artists['type'] = 'city'
                name = result.get('artist-list')[n].get("name") #this is the name of the band/artist
                area = result.get('artist-list')[n].get("area").get('name').lower() #area of the artists, we use this to verify that the area is the correct area and we lowercase

                if(area == city.lower()):
                    artists.get('artists').append({"name": name})#append onto the artists array the name of the artists

            offset += 50
    offset = 0
    #if there are no artists on that city then it will be by state or user chooses state then we search by state
    if(preffered == 'state' or ( preffered != 'country' and len(artists.get('artists')) == 0)):
         while(offset < limit):
            result = musicbrainzngs.search_artists(area=state, offset=offset, limit=limit)

            for n in range(len(result.get('artist-list'))):
                artists['type'] = 'state'
                name = result.get('artist-list')[n].get("name") #this is the name of the band/artist
                area = result.get('artist-list')[n].get("area").get('name').lower() #area of the artists, we use this to verify that the area is the correct area and we lowercase

                if(area == state.lower()):
                    artists.get('artists').append({"name": name})#append onto the artists array the name of the artists
            
            offset += 50
    offset = 0
    #if there are no artists on that state or user chooses country then it will be by country
    if(len(artists.get('artists')) == 0):
        while(offset < limit):
            result = musicbrainzngs.search_artists(area=country, offset=offset, limit=limit)

            for n in range(len(result.get('artist-list'))):
                artists['type'] = 'country'
                name = result.get('artist-list')[n].get("name") #this is the name of the band/artist
                area = result.get('artist-list')[n].get("area").get('name').lower() #area of the artists, we use this to verify that the area is the correct area and we lowercase

                if(area == country.lower()):
                    artists.get('artists').append({"name": name})#append onto the artists array the name of the artists

            offset += 50
    
    #randomize 
    random.shuffle(artists['artists'])
    artists['artists']=artists['artists'][0:99]
    return artists

#this function calls the get artist fucntion and for each artist calls the get top tracks functions. it takes advantage of concurrecny so as to speed up the process
async def getArtistData(city, state, country, preffered=None):

    x=getArtists(city, state, country, preffered) #var holding all the artists names

    access_token = await get_spotify_access_token()

    async with aiohttp.ClientSession() as session:
        tasks = []#array used to append all the tasks the threads will run
        for artist in x.get('artists'): #extract artist name from above function and pass to get_artist_top_tracks function to get top tracks of each artist
            artist_name = artist.get('name')
            tasks.append(get_artist_top_tracks(session, access_token, artist_name))  # Append the async task to the list

        results = await asyncio.gather(*tasks)#we wait for each theread to return

    arr1=[]#this array will contain artist key that gives an array for the top tracks of each individual artist

    for result, artist in zip(results, x.get('artists')):
        top_track, artist_img, genre = result
        if top_track and artist_img:
            song_dict = {
                'Name': artist.get('name'),
                'TopSongs': top_track,
                'Image': artist_img,
                'Genre': genre
            }
            arr1.append({"artist": song_dict})

    format_dict = {'type': x.get('type'), 'artists': arr1} #{type:city, artists:[]}
    return format_dict


#function to make the async call for the get artist data function
def run_get_artist_data(city, state, country, preffered=None):
    return asyncio.run(getArtistData(city, state, country, preffered))



#route for the front-end to send the city to the back end
@app.route('/city_post', methods=['POST']) #only will accept POST
@cross_origin()#make this specific route CORS capable
def city_post():
    city = (request.json).get('city')
    state = (request.json).get('state')#parse data for function call
    country = (request.json).get('country')
    preffered = (request.json).get('preffered')

    artistsData = run_get_artist_data(city, state, country, preffered)
    returnData = {"city": city, "state": state, "country": country, "data": artistsData}

    return jsonify(returnData)

#format of return: {city:xx, state:xx country:xx, data:{type:xx, artists:[{xx}] }}


#when the file is ran directly it will run the app server.
if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8000)

