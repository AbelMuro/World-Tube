import React from 'react';
import {firestore} from '../Firebase-config';
import {collection, query, where, orderBy} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";
import {useNavigate, useLocation} from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import {CircularProgress} from '@mui/material';
import UseCookies from './useCookies';


//TODO: also, put all the videos in a black container, this will make sure that every video is the same width and height
//TODO: work on the css in the other videos of the display video component
function HomePage() {
    const {state} = useLocation();
    const allVideosRef = collection(firestore, "developers collection/allVideos/videoCollection");      
    const q = state ? state?.search ? query(allVideosRef, where("searchTitle", ">=", state.search), where("searchTitle", "<=", state.search + '\uf8ff')) :
                      state.category != "All" ? query(allVideosRef, where("category", "==", state.category)) : query(allVideosRef, orderBy("order", "desc"))
              : query(allVideosRef, orderBy("order", "desc"));
    const [allVideos, loading] = useCollectionData(q);
    const navigate = useNavigate();

    const playVideoOnHover = (e) => {
        const videoContainer = e.target.parentElement;
        videoContainer.style.zIndex = 1;
        e.target.play();
    }   

    const stopVideoOnLeave = (e) => {
        const videoContainer = e.target.parentElement;
        videoContainer.style.zIndex = 0;
        e.target.pause();
    } 

    const videoLoaded = (e) => {
        const loadingBox = e.target.previousElementSibling;
        loadingBox.style.display = "none";
    }

    const handleNavigate = (e) => {
        let videoData = e.target.getAttribute("data-video");
        videoData = JSON.parse(videoData);
        navigate(`/${videoData.title}`, {state: videoData});
    }


    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.gridContainer}>
                {loading ? <LoadingScreen/> : allVideos.map((video) => {
                    return (
                        <div key={uuid()} data-id={video.videoID} data-user={video.userID}>
           
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingBox}>
                                    <CircularProgress disableShrink/>
                                </div>
                                <video className={styles.video} data-video={JSON.stringify(video)} onClick={handleNavigate} onMouseOver={playVideoOnHover} onMouseLeave={stopVideoOnLeave} onLoadedData={videoLoaded} muted>
                                    <source src={`${video.url}#t=4`}/>
                                    Your Browser doesn't support videos
                                </video>                                  
                            </div>
   
                            <h2 className={styles.videoTitle}>
                                {video.title}
                            </h2>    
                            <p className={styles.videoDesc}>
                                <img src={video.userImage} className={styles.userImage}/>
                                <span id={styles.username}>
                                    {video.username} 
                                </span> 
                            </p>   
                            <div className={styles.videoTimeStamp}>
                                Posted on: 
                                <p>
                                    {video.timeCreated}
                                </p>
                            </div>                
                        </div>
                    )
                })}
            </div>
            <UseCookies/>
        </section>
    )
}

export default HomePage