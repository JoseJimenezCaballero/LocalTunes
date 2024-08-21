import React from "react"
import { motion } from 'framer-motion'

//this component holds the front page footer
export default function Footer(){
    return(
        <motion.div initial={{x:-65, opacity:0 }} animate={{x:0, opacity:1 }} transition={{ease:"easeInOut",duration:1.30}} className="footer--container">
            <img src="./images/footer2.png" className="footer--img" />
        </motion.div>
    )
}