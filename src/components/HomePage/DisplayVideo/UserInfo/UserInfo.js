import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {doc} from 'firebase/firestore';
import {firestore} from '~/components/Firebase-config';
import styles from './styles.module.css';

function UserInfo({userID}) {
    const docRef = doc(firestore, `${userID}/userInfo`);
    const [userInfo, loading, error] = useDocumentData(docRef);

    return(
        <p className={styles.videoDesc}>
            {!loading && <img src={userInfo.imageURL} className={styles.userImage}/>}
            <span id={styles.username}>
                {!loading && userInfo.username} 
            </span> 
        </p>   
    )
}

export default UserInfo;