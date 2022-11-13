import React from 'react';
import {auth} from '../Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import styles from './styles.module.css';
import {CircularProgress} from '@mui/material';
import DisplayVideos from './DisplayVideos';
import Popup from './Popup';
import UpdateAccount from './UpdateAccount';


function AccountPage() {
    const [user] = useAuthState(auth);

    function getDateCreated() {
        const dateCreated = new Date(Number(user.metadata.createdAt));
        return dateCreated.toDateString();
    }

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
                    <p className={styles.desc}>
                        Hi im new here and i like to upload videos.
                        I love programming and i love playing games on 
                        my pc and ps5. Thats right, i got my hands on a ps5.
                        Don't be jealous.
                    </p>
                </div>
                <UpdateAccount />
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