import React from 'react';
import {firestore} from '../Firebase-config';
import {collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";
import {useNavigate} from 'react-router-dom';

function HomePage() {
    const allVideosRef = collection(firestore, "developers collection");       //allVideosRef is an array of document
    const [allVideos, loading] = useCollectionData(allVideosRef)
    const navigate = useNavigate();


    const playVideoOnHover = (e) => {
        e.target.play();
    }   

    const stopVideoOnLeave = (e) => {
        e.target.pause();
    } 

    const handleNavigate = (e) => {
        const selectedVideo = e.target.parentElement;
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
        localStorage.setItem("video", JSON.stringify(videoData));
        navigate("/" + title);
    }

    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.flexContainer}>
                {loading ? <>loading....</> : allVideos.map((video) => {
                    return (
                        <div className={styles.videoContainer} key={uuid()} data-id={video.videoID} data-user={video.userID}>
                            <video className={styles.video} onClick={handleNavigate} onMouseOver={playVideoOnHover} onMouseLeave={stopVideoOnLeave}>
                                <source src={video.url} type="video/mp4"/>
                                Your Browser doesn't support videos
                            </video>     
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