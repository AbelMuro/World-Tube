import React from 'react';
import {firestore} from '../Firebase-config';
import {collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";
import {useNavigate} from 'react-router-dom';

function HomePage() {
    const allVideosRef = collection(firestore, "All videos");       //allVideosRef is an array of document
    const [allVideos, loading] = useCollectionData(allVideosRef)
    const navigate = useNavigate();

    //TODO: pass the title of the video to a router and the md5hash to the local storage
    const handleNavigate = () => {
        navigate("");
    }

    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.flexContainer}>
                {loading ? <>loading....</> : allVideos.map((video) => {
                    return (
                        <div className={styles.videoContainer} key={uuid()}>
                            <video className={styles.video} onClick={handleNavigate} data-hash={video.md5hash}>
                                <source src={video.url} type="video/mp4"/>
                            </video>     
                            <h2 className={styles.videoTitle}>
                                {video.title}
                            </h2>    
                            <p className={styles.videoDesc}>
                                <img src={video.userImage} className={styles.userImage}/>
                                {video.username}  
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