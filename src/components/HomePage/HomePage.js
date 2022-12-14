import React, {useRef} from 'react';
import {firestore} from '../Firebase-config';
import {collection, query, where, orderBy} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";
import {useNavigate, useLocation} from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import UseCookies from './useCookies';


function HomePage() {
    const {state} = useLocation();
    const allVideosRef = collection(firestore, "developers collection/allVideos/videoCollection");      
    const q = state ? state?.search ? query(allVideosRef, where("searchTitle", ">=", state.search), where("searchTitle", "<=", state.search + '\uf8ff')) :
                      state.category != "All" ? query(allVideosRef, where("category", "==", state.category)) : query(allVideosRef, orderBy("order", "desc"))
              : query(allVideosRef, orderBy("order", "desc"));
    const [allVideos, loading] = useCollectionData(q);
    const navigate = useNavigate();
    const videoPlayback = useRef();

    
    const playVideoOnHover = (e) => {
        e.target.style.zIndex = 1;
        e.target.lastElementChild.style.display = "block";
        videoPlayback.current = setTimeout(() => {
            e.target.lastElementChild.style.display = "none";
            const thumbnail = e.target.firstElementChild;
            thumbnail.style.display = "none";
            const video = e.target.querySelector("." + styles.video);
            video.style.display = "block"
            video.play()
        }, 2000)
    }   

    const stopVideoOnLeave = (e) => {
        clearTimeout(videoPlayback.current);
        e.target.style.zIndex = 0;
        e.target.lastElementChild.style.display = "none";
        const thumbnail = e.target.firstElementChild;
        thumbnail.style.display = "block";
        const video = e.target.querySelector("." + styles.video);
        video.style.display = "none"
        video.pause();
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
                            <div className={styles.videoContainer} onMouseEnter={playVideoOnHover} onMouseLeave={stopVideoOnLeave} onClick={handleNavigate} data-video={JSON.stringify(video)}>
                                <img src={video.thumbnail} className={styles.thumbnail} />
                                <video className={styles.video} muted controls>
                                    <source src={video.url}/>
                                    Your browser doesn't support videos    
                                </video>   
                                <p className={styles.keepHovering}>
                                    Keep hovering to play..
                                </p> 
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