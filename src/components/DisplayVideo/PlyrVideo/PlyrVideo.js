import React, {forwardRef, useEffect} from 'react';
import {usePlyr} from 'plyr-react';
import './plyr.css';
import styles from './styles.module.css';


const PlyrVideo = forwardRef((props, ref) => {
    const { source, options = null, isHeightBiggerThanWidth } = props
    const raptorRef = usePlyr(ref, { source, options})

    useEffect(() => {
        if(isHeightBiggerThanWidth) {
            const background = document.querySelector("#background");
            background.setAttribute("class", styles.plyrVideo);
            const video = document.querySelector(".plyr__video-wrapper").firstElementChild;
            video.setAttribute("id", styles.plyrVideo);
        }
    })

    return(
        <div id="background">
            <video ref={raptorRef} className="plyr-react plyr"/>                              
        </div>
    )  

})


export default PlyrVideo;