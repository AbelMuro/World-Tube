import React from 'react';
import styles from './styles.module.css';
import {doc} from 'firebase/firestore';
import {useDocumentData} from 'react-firebase-hooks/firestore'
import {firestore} from '~/components/Firebase-config';
import icons from '~/common/Icons';

function UserInfo({userID}) {
    const docRef = doc(firestore, `${userID}/userInfo`);
    const [userInfo, loading, error] = useDocumentData(docRef);

    return(
        <p className={styles.username}> 
            {!loading && <img src={userInfo.imageURL || icons['avatar']} className={styles.userImage}/>}
            {!loading && userInfo.username}
        </p>
    )
}

export default UserInfo;