import React from 'react';
import styles from './styles.module.css';
import icons from '~/common/Icons';
import {doc} from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {firestore} from '~/components/Firebase-config';

function UserInfo({userID}) {
    const docRef = doc(firestore, `${userID}/userInfo`);
    const [userInfo, loading, error] = useDocumentData(docRef);

    return(                        
        <div className={styles.userInfo}>
            {!loading && <img src={userInfo.imageURL || icons['avatar']} className={styles.userImage}/>}              
            <p className={styles.username}>
                {!loading && userInfo.username}
            </p>
        </div>
    )
}

export default UserInfo;