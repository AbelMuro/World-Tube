import React, { useState, useEffect} from 'react';
import {auth, firestore} from '../Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import {} from 'react-firebase-hooks/firestore'
import { doc, getDoc } from 'firebase/firestore';
import styles from './styles.module.css';
import {CircularProgress} from '@mui/material';
import DisplayVideos from './DisplayVideos';
import Popup from './Popup';
import UpdateAccount from './UpdateAccount';


function AccountPage() {
    const [user] = useAuthState(auth);
    const [,forceRender] = useState(0.00000000001);

    
    function getDateCreated() {
        const dateCreated = new Date(Number(user.metadata.createdAt));
        return dateCreated.toDateString();
    }

    useEffect(() => {
        if(user) {
            const aboutMeDoc = doc(firestore, `${user.uid}/userInfo`);
            getDoc(aboutMeDoc)
                .then((doc) => {
                    const docData = doc.data();
                    const aboutMe = document.getElementById("aboutMe");
                    aboutMe.innerHTML = docData.aboutMe;                    
                })
        }
    })

    return user ? (
        <section className={styles.accountContainer}>
            <div className={styles.basicInfoContainer}>
                <div className={styles.basicInfo}>    
                    <img src={user.photoURL} className={styles.usersAvatar}/>
                    <div className={styles.userInfo}>
                        <p className={styles.username}>
                            {user.displayName}
                        </p>
                    </div>
                </div>
                <div className={styles.otherInfo}>
                    <h2 className={styles.title}>
                        Email: 
                    </h2>
                    <p className={styles.desc}>
                        {user.email}
                    </p>
                    <h2 className={styles.title}>
                        First joined: 
                    </h2>
                    <p className={styles.desc}>
                        {getDateCreated()}
                    </p>
                    <h2 className={styles.title} id={styles.aboutMe}>
                        About Me:
                    </h2>
                    <p className={styles.desc} id="aboutMe">

                    </p>
                </div>
                <UpdateAccount forceRender={forceRender}/>                    
            </div>

            <div className={styles.videosUploaded}>     
                <Popup user={user}/>
                <h1 className={styles.yourVideosTitle}>Your Videos:</h1> 
                <DisplayVideos userID={user.uid}/>
            </div>
        </section>
    ) : (<div className={styles.loading}><CircularProgress/></div>)
}

export default AccountPage;
