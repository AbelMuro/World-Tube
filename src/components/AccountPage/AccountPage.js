import React, { useState, useEffect} from 'react';
import {auth, firestore} from '~/components/Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import {doc, getDoc} from 'firebase/firestore';
import styles from './styles.module.css';
import {CircularProgress} from '@mui/material';
import DisplayVideos from './DisplayVideos';
import UploadVideo from './UploadVideo';
import UpdateAccount from './UpdateAccount';
import {Button, useMediaQuery} from '@mui/material';
import {styled} from '@mui/system';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import icons from '~/common/Icons';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";
    width: 500px; 
    display: block;
    margin: auto;   
    margin-top: 40px;
    text-align: center;

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     

`
//i need to import the empty avatar here and refactor the account page
function AccountPage() {
    const navigate = useNavigate();    
    const [user] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState({});
    const [,forceRender] = useState(false);                     //forceRender will be used by one of the child components to render the parent component  

    function getDateCreated() {
        const dateCreated = new Date(Number(user.metadata.createdAt));
        return dateCreated.toDateString();
    }



    useEffect(() => {
        if(user) {
            const userDocRef = doc(firestore, `${user.uid}/userInfo`);
            getDoc(userDocRef)
                .then((doc) => {
                    const docData = doc.data();
                    setUserInfo(docData);                             
                })
        }
    })

    return user ? (
        <section className={styles.accountContainer}>
            <div className={styles.basicInfoContainer}>
                <div className={styles.basicInfo}>    
                    <img src={userInfo.imageURL || icons['avatar']} className={styles.usersAvatar}/>
                    <div className={styles.userInfo}>
                        <p className={styles.username}>
                            {userInfo.username} 
                        </p>
                    </div>
                </div>
                <div className={styles.otherInfo}>
                    <h2 className={styles.title}>
                        Email: 
                    </h2>
                    <p className={styles.desc}>
                        {user && user.email}
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
                        {userInfo.aboutMe ? userInfo.aboutMe : "user hasn't written anything"}
                    </p>
                </div>
                <UpdateAccount forceRender={forceRender} />                 
            </div>

            <div className={styles.videosUploaded}>     
                <UploadVideo user={user}/>
                <h1 className={styles.yourVideosTitle}>Your Videos:</h1> 
                <DisplayVideos userID={user.uid}/>
            </div>
        </section>
    ) : (<div className={styles.loading}><CircularProgress/></div>)
}

export default AccountPage;
