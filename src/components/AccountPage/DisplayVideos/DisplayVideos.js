import React, {memo} from 'react';
import {v4 as uuid} from 'uuid';

import {collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore'
import {firestore} from '../../Firebase-config';

import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {CircularProgress} from '@mui/material';


function DisplayVideos({userID}) {
    const collectionRef = collection(firestore, userID);
    const [videos, loading] = useCollectionData(collectionRef);
    const navigate = useNavigate();

    const handleLoad = (e) => {
        const loadingBlock = e.target.previousElementSibling;
        loadingBlock.style.display = "none";
    }

    const displayVideo = (e) => {
        let video = e.target.getAttribute("data-video");
        video = JSON.parse(video);
        let title = video.title;
        let username = video.username
        let userImage = video.userImage;
        let videoURL = video.url;
        let timeStamp = video.timeCreated;
        let userID = video.userID;
        let videoID = video.videoID;
        const videoData = {
            title: title,
            username: username,
            userImage: userImage,
            timeStamp: timeStamp,
            URL: videoURL,
            videoID: videoID,
            userID: userID,
        }
        navigate(`/${title}`, {state: videoData});
    }       

    return loading ? (<div className={styles.loading}><CircularProgress /></div>) : (
        <section className={styles.allVideos}>
            {videos ? videos.map((video) => {
                if(video.url){
                    return(
                        <div key={uuid()} className={styles.videoContainer} >
                            <div className={styles.loadingVideo}>
                                <CircularProgress/>
                            </div>
                            <video className={styles.videos} onClick={displayVideo} onLoadedData={handleLoad} data-video={JSON.stringify(video)}>
                                <source src={video.url}/>
                                Your browser doesn't support videos
                            </video>                            
                        </div>
                    )
                }  
                }) : <>no videos</>
            }
        </section>
    );
}

export default memo(DisplayVideos);