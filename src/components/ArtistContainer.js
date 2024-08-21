import React from "react"
import GenreButton from "./GenreButton"
import ResultsFooter from "./ResultsFooter"
import {motion} from 'framer-motion'

export default function ArtistContainer({artists, type, onClick}){

    //artist container will hold every artist tile as well as the genre buttons and load more button

    const [limit, setLimit] = React.useState(5)//limit state used to set the limit of tiles at a time, user can show more and this will be expanded by 5
    const [isGenreActive, setIsGenreActive] = React.useState(false)//state used to know if the genres are showing or not
    const [selectedGenre, setSelectedGenre] = React.useState("")//state used to know which genre is currently active so as to display tiles based on that genre

    //function toggles genres from showing or not
    function toggleGenres(){
        setIsGenreActive(prevState => !prevState)
    }

    //function increases number of tiles showing
    function handleLoad(){
        setLimit(prevCount => prevCount+5)
    }

    //function toggles which genre is currently active
    function toggleSelectedGenre(genre){
        setSelectedGenre(genre)
        
    }

    //function to reset the genre back to default
    function toggleShowAll(){
        setSelectedGenre("")
        setLimit(5)
    }

    //function to filter artists based on genre, it returns a new array with only the tiles with the correct genre
    function filterArtists(genre, artists){
        if(!genre){
            return artists
        }

        return artists.filter(artist => artist.props.genre === genre); 
    }


    const genres = artists.map(artist =>{//this array will contain all the genres available to be displayed
        return(
            artist.props.genre
        )
    } )

    //here we get the unique genres
    const uniqueGenres = Array.from(new Set(genres)) //make genres unique into an array
    
    const genreButtonElements = uniqueGenres.map(genre =>{//we create buttons based on the name of the genres
        return(
            <GenreButton genre={genre ? genre : false} onClick={toggleSelectedGenre} toggleDropdown={toggleGenres}/>
        )
    } )

    
    return(
        <div className="artists--container">
            <button style={{marginLeft: "auto", marginRight: "1em"}} className="genreButton" onClick={toggleGenres}>{isGenreActive ? <>Hide Genres <i className="bi bi-arrow-up-short"></i></> : <>Show Genres <i className="bi bi-arrow-down-short"></i></>}</button>
            {selectedGenre && <button style={{marginRight: "auto", marginLeft: "1em", marginTop: "-1.8em"}} className="genreButton" onClick={toggleShowAll}>Show All</button>}

            {isGenreActive && <motion.div
            layout 
            initial={{ opacity: 0, y: -51 }}
            animate={{ opacity: 1, y: 1 }}
            exit={{ opacity: 0, y: -51 }}
            transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 15,
                duration: 0.9 }}
            
            className="artists--container--genre--container">

                    {genreButtonElements}
            </motion.div>}

            {selectedGenre ? filterArtists(selectedGenre, artists).slice(0,limit) : artists.slice(0,limit)}
            {limit <= filterArtists(selectedGenre, artists).length && artists.length && <button className="artists--container--loadMore" onClick={handleLoad}>Load more</button>}

            {limit > filterArtists(selectedGenre, artists).length && artists.length && type != 'country' && <ResultsFooter onClick={onClick} />}
        </div>
    )
}