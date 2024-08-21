import React, { useState } from "react"
import {motion} from 'framer-motion'
import ArtistTrack from "./ArtistTrack"

//this component handles artist tiles

export default function Artist({artistName, artistImg, topSongs, genre}){
    const [isExpanded, setIsExpanded] = useState(false); //bool to check if tile is expanded

    //click handles function to set if the tile is expanded or not
    function clickHandler(){
        setIsExpanded(prevState => !prevState)
    }

    //The following is to fill the artist track portion of the artist tile, it will map through the top songs and generate a track component per track
    let index = 0 //index used to track which track it is and add animation times based on the track
    let tracks = topSongs.map(track => {
        let delayTime = 0.25 * (index + 1)
        index = index + 1

        return(
        <ArtistTrack 
            trackImg={track.AlbumCover} 
            trackName={track.SongName} 
            trackUrl={track.UrlToSong}
            trackYear={track.ReleaseYear}
            delayTime={delayTime}
        />
        )
    })
    
    return(
        <motion.div 
            className={`artist--tile${isExpanded ? '-expanded' : ''}`} 
            onClick={clickHandler} 
            initial={{ width: '90%', height: '24vh'}} 
            animate={{ width: isExpanded ? '92vw' : '62vw', height: isExpanded ? '75vh' : '31vh'}}
            transition={{ duration: 0.2}}
        >   
            <img className={`artist--tile${isExpanded ? '--expanded--img' : '--img'}`} src={artistImg}/>
            {isExpanded && <motion.h2 initial={{ opacity: 0, y: 44.5 }} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.25 }} className="artist--tile--badge">{artistName}</motion.h2>}
            <div className="artist--tile-expanded--popular--container">
                {isExpanded && <motion.h4 initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: 0.25 }} className="artist--tile-expanded--h4">Popular releases</motion.h4>}
                {isExpanded && genre && <motion.h4 style={{color:"#C0C0C0", fontWeight:"400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: 0.25 }} className="artist--tile-expanded--h4">Genre: {genre}</motion.h4>}
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                {isExpanded && tracks}
            </div>

            {!isExpanded && <motion.h3 initial={{ opacity:0, y: -34.5}} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.10 }} className="artist--tile--h3">{artistName}</motion.h3>}
            {!isExpanded && genre && <motion.h4 initial={{ opacity:0, y: -34.5}} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.10 }} className="artist--tile--genreBadge">{genre}</motion.h4>}

        </motion.div>
    )
}