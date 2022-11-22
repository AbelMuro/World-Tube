import React, {memo} from 'react';
import {v4 as uuid} from 'uuid';

import {collection, query , where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore'
import {firestore} from '../../Firebase-config';

import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {CircularProgress} from '@mui/material';


function DisplayVideos({userID}) {
    const collectionRef = collection(firestore, userID);
    const q = query(collectionRef, where("url", "!=", false ));
    const [videos, loading] = useCollectionData(q);
    const navigate = useNavigate();

    const handleLoad = (e) => {
        const loadingBlock = e.target.previousElementSibling;
        loadingBlock.style.display = "none";
    }

    const displayVideo = (e) => {
        let videoData = e.target.getAttribute("data-video");
        videoData = JSON.parse(videoData);
        navigate(`/${videoData.title}`, {state: videoData});
    }       

    return loading ? (<div className={styles.loading}><CircularProgress /></div>) : (
        <section className={styles.allVideos}>
            <div></div>
            {videos.length > 0 ? videos.map((video) => {
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
                }) : <div className={styles.noVideos}>no videos</div>
            }
        </section>
    );
}

export default memo(DisplayVideos);