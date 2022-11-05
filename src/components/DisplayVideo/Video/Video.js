import React, {memo} from 'react';
import styles from './styles.module.css';

function Video() {
    return(                
        <video className={styles.video} controls id="mainVideo">
            <source type="video/*"/>
            Your Browser doesn't support videos
        </video>
    )
}

export default memo(Video);