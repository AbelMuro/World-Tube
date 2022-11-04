import React, {memo} from 'react';
import {v4 as uuid} from 'uuid';

import {collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore'

import styles from './styles.module.css';

function DisplayVideos({userID, firestore}) {
    const collectionRef = collection(firestore, userID);
    const [videos, loading] = useCollectionData(collectionRef);

    return loading ? (<>loading</>) : (
        <section className={styles.allVideos}>
            {videos ? videos.map((video) => {
                if(video.url){
                    return(
                        <div key={uuid()} className={styles.videoContainer}>
                            <video className={styles.videos} controls>
                                <source src={video.url} type="video/mp4"/>
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