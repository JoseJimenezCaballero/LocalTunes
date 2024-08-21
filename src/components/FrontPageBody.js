import React from "react"
import { motion } from 'framer-motion'

//this component holds the front page body
export default function Body(props){

    return(
        <motion.div initial={{x:-65, opacity: 0}} animate={{x:0, opacity:1 }} transition={{ease:"easeInOut",duration:1.15}} className="body--container">
            <h1 className="body--h1">Discover New Artists in Your City </h1>
            <button className="body--button" onClick={props.toggle}>Get started <i className="bi bi-arrow-right"></i></button>
            <p className="body--p">Explore Artists, Find Vibes.</p>
        </motion.div>
    )

}