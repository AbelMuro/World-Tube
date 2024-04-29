import React, {forwardRef, useEffect} from 'react';
import {usePlyr} from 'plyr-react';
import './plyr.css';


const PlyrVideo = forwardRef((props, ref) => {
    const { source, options = null} = props
    const raptorRef = usePlyr(ref, { source, options})


    return(
        <div id="background">
            <video ref={raptorRef} className="plyr-react plyr" style={{height: 'auto'}}/>                              
        </div>
    )  

})


export default PlyrVideo;