import React, {forwardRef, useEffect} from 'react';
import {usePlyr} from 'plyr-react';
import './plyr.css';
import styles from './styles.module.css';


const PlyrVideo = forwardRef((props, ref) => {
    const { source, options = null, isHeightBiggerThanWidth } = props
    const raptorRef = usePlyr(ref, { source, options})

    useEffect(() => {
        if(isHeightBiggerThanWidth) {
            document.querySelector("#plyrVideo").setAttribute("class", styles.plyrVideo);
            document.querySelector("#background").setAttribute("class", styles.background);
        }
    })
    
    return(
        <div id="background">
            <div id="plyrVideo">
                <video ref={raptorRef} className="plyr-react plyr"/>                
            </div>
        </div>
    )  

})


export default PlyrVideo;