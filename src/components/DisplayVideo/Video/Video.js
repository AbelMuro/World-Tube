import React, {memo} from 'react';
import styles from './styles.module.css';

function Video({url}) {
    return(                
        <video className={styles.video} controls id="mainVideo">
            <source src={url} type="video/mp4"/>
            Your Browser doesn't support videos
        </video>
    )
}

export default memo(Video);