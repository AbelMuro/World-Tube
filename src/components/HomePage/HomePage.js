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

    const videoLoaded = async (e) => {
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
                            <div className={styles.videoContainer}>
                                <img src={video.thumbnail} className={styles.thumbnail} data-video={JSON.stringify(video)} onClick={handleNavigate}/>
                                <div className={styles.playVideo}>
                                    <video className={styles.video}>
                                        <source src={video.url} size={720}/>
                                        Your browser doesn't support videos    
                                    </video>    
                                </div>                          
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