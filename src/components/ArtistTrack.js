import React from "react"
import { motion } from 'framer-motion'

//this component will hold every top track and display their info
export default function ArtistTrack({trackImg,trackName,trackYear, trackUrl, delayTime}){
    return(
        <div className="artist--tile--expanded--album--container">
            <motion.img initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: delayTime }}  src={trackImg} className="artist--tile--expanded--album" />
            <motion.h4 initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: delayTime }} >{trackName}</motion.h4>
            <motion.p initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: delayTime }} >{trackYear}</motion.p>
            <motion.button initial={{ opacity: 0, x: 44.5 }} animate={{ opacity:1, x: 0 }} transition={{ delay: delayTime }} onClick={() => window.location.href=trackUrl}>Listen on <i className="bi bi-spotify green"></i></motion.button>
        </div>
    )
}