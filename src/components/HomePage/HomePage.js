import React from 'react';
import {firestore} from '../Firebase-config';
import {collection, query, where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";
import {useNavigate, useLocation} from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import {CircularProgress} from '@mui/material';

function HomePage() {
    const data = useLocation();
    const allVideosRef = collection(firestore, "developers collection");       //allVideosRef is an array of document
    const q = data.state ? data.state.category != "All" ? query(allVideosRef, where("category", "==", data.state.category)) : query(allVideosRef)
    : query(allVideosRef);
    const [allVideos, loading] = useCollectionData(q)
    const navigate = useNavigate();

    const playVideoOnHover = (e) => {
        e.target.play();
    }   

    const stopVideoOnLeave = (e) => {
        e.target.pause();
    } 

    const videoLoaded = (e) => {
        const loadingBox = e.target.previousElementSibling;
        loadingBox.style.visibility = "hidden";
    }

    const handleNavigate = (e) => {
        const selectedVideo = e.target.parentElement.parentElement;
        const videoID = selectedVideo.getAttribute("data-id");
        const userID = selectedVideo.getAttribute("data-user");
        const title = selectedVideo.querySelector("." + styles.videoTitle).innerHTML;
        const username = selectedVideo.querySelector("." + styles.videoDesc).lastChild.innerHTML;
        const userImage = selectedVideo.querySelector("." + styles.videoDesc).firstChild.src;
        const timeStamp = selectedVideo.querySelector("." + styles.videoTimeStamp).innerHTML;
        const videoURL = selectedVideo.querySelector("video").firstChild.src;
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

    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.flexContainer}>
                {loading ? <LoadingScreen/> : allVideos.map((video) => {
                    return (
                        <div key={uuid()} data-id={video.videoID} data-user={video.userID}>
           
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingBox}>
                                    <CircularProgress />
                                </div>
                                <video className={styles.video} onClick={handleNavigate} onMouseOver={playVideoOnHover} onMouseLeave={stopVideoOnLeave} onLoadedData={videoLoaded}>
                                    <source src={video.url} type="video/mp4"/>
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
                            <p className={styles.videoTimeStamp}>
                                {video.timeCreated}
                            </p>                
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default HomePage