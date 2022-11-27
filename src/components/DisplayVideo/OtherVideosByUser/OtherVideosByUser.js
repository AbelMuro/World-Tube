import React from 'react';
import {collection, query, where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {firestore} from '../../Firebase-config';
import {v4 as uuid} from 'uuid';
import {useNavigate} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import styles from './styles.module.css';


function OtherVideosByUser({videoData}) {
    const collectionRef = collection(firestore, `${videoData.userID}`);
    const q = query(collectionRef, where("title", "!=", `${videoData.title}`));
    const [allUsersVideos, loading] = useCollectionData(q);
    const navigate = useNavigate();

    const handleVideoLink = (e) => {
        let videoData = e.target.getAttribute("data-video");
        videoData = JSON.parse(videoData);
        navigate(`/${videoData.title}`, {state : videoData});
        window.location.reload(false);
    }

    return(
        <>
            <h1 className={styles.otherVideosTitle}>
                Other videos by {videoData.username}
            </h1>
            {loading ? <div className={styles.loading}><CircularProgress/></div> : allUsersVideos.length >= 1 ? allUsersVideos.map((video) => {
                    return (
                        <div className={styles.otherVideoContainer} key={uuid()}>
                            <a className={styles.videoLink} onClick={handleVideoLink} data-video={JSON.stringify(video)}>
                                <img className={styles.thumbnail} src={video.thumbnail}/>                               
                            </a>
                            <p className={styles.otherVideoTitle}>
                                {video.title}   
                            </p>                              
                        </div>
                    ) 
                    }) : <h2 className={styles.noOtherVideos}>No other videos</h2>
                }

        </>
    )
}

export default OtherVideosByUser;