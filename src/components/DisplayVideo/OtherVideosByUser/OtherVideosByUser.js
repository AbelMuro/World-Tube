import React, {lazy} from 'react';
import {collection, query, where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {firestore} from '~/components/Firebase-config';
import {v4 as uuid} from 'uuid';
import {CircularProgress} from '@mui/material';
import styles from './styles.module.css';
import UserInfo from './UserInfo';
const DisplayVideo = lazy(() => import('./DisplayVideo'));

function OtherVideosByUser({videoData}) {
    const collectionRef = collection(firestore, `${videoData.userID}`);
    const q = query(collectionRef, where("title", "!=", `${videoData.title}`));
    const [allUsersVideos, loading] = useCollectionData(q);

    return(
        <>
            <UserInfo userID={videoData.userID}/>
            {loading ? <div className={styles.loading}><CircularProgress/></div> : allUsersVideos.length >= 1 ? allUsersVideos.map((video) => {
                    return (
                        <DisplayVideo video={video} key={uuid()}/>
                    ) 
                    }) : <h2 className={styles.noOtherVideos}>No other videos</h2>
                }

        </>
    )
}

export default OtherVideosByUser;