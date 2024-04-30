import React from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';

function DisplayVideo({video}) {
    const navigate = useNavigate();

    const handleVideoLink = (e) => {
        navigate(`/${video.title}`, {state : video});
        window.location.reload(false);
    }


    return(
        <div className={styles.otherVideoContainer}>
            <a className={styles.videoLink} onClick={handleVideoLink}>
                <img className={styles.thumbnail} src={video.thumbnail}/>                               
            </a>
            <p className={styles.otherVideoTitle}>
                {video.title}   
            </p>                              
        </div>
    )
}

export default DisplayVideo;