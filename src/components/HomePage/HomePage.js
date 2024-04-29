import React, {lazy} from 'react';
import {firestore} from '../Firebase-config';
import {collection, query, where, orderBy} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {useLocation} from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
const DisplayVideo = lazy(() => import('./DisplayVideo'));

function HomePage() {
    const {state} = useLocation();
    const allVideosRef = collection(firestore, "developers collection/allVideos/videoCollection");      
    const q = state ? state?.search ? query(allVideosRef, where("searchTitle", ">=", state.search), where("searchTitle", "<=", state.search + '\uf8ff')) :
                      state.category != "All" ? query(allVideosRef, where("category", "==", state.category)) : query(allVideosRef, orderBy("order", "desc"))
              : query(allVideosRef, orderBy("order", "desc"));
    const [allVideos, loading] = useCollectionData(q);

    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.gridContainer}>
                {loading ? <LoadingScreen/> : allVideos.map((video) => {
                    return (
                       <DisplayVideo key={video.videoID} video={video}/>
                    )
                })}
            </div>
        </section>
    )
}

export default HomePage