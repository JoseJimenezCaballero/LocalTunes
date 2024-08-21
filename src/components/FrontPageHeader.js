import React from "react"
import { easeInOut, motion } from 'framer-motion'

//this component holds the front page header
export default function Header(){
    return(
        <motion.div initial={{x:-65, opacity:0 }} animate={{x:0, opacity:1 }} transition={{ease:"easeInOut",duration:1.0 }} className="header">
            <img className="header--img" src="./images/logo.png"/>
            <h1 className="header--h1">Local Tunes</h1>
        </motion.div>
    )
}