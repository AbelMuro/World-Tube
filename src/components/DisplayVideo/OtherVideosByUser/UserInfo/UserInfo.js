import React from 'react';
import styles from './styles.module.css';
import {doc} from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore} from '~/components/Firebase-config';

function UserInfo({userID}) {
    const docRef = doc(firestore, `${userID}/userInfo`);
    const [userInfo, loading, error] = useDocumentData(docRef);

    return(
        <h1 className={styles.otherVideosTitle}>
            Other videos by {!loading && userInfo.username}
        </h1>
    )
}

export default UserInfo;