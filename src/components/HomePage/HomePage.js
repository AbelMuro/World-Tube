import React from 'react';
import {firestore} from '../Firebase-config';
import {collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";

function HomePage() {
    const allVideosRef = collection(firestore, "All videos");       //allVideosRef is an array of document
    const [allVideos, loading] = useCollectionData(allVideosRef)

    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.flexContainer}>
                {loading ? <>loading....</> : allVideos.map((video) => {
                    return (
                        <div className={styles.videoContainer} key={uuid()}>
                            <video className={styles.video}>
                                <source src={video.url} type="video/mp4"/>
                            </video>     
                            <h2>
                                name of video    
                            </h2>    
                            <p>
                                <img src="" className=""/>
                                creator of video    
                            </p>   
                            <p>
                                created 25 days ago    
                            </p>                
                        </div>

                    )
                })}
            </div>
        </section>
    )
}

export default HomePage