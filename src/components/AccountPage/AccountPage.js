import React, {useEffect, useState} from 'react';

import {auth, storage, firestore} from '../Firebase-config';
import {ref as storageRef} from 'firebase/storage';
import {collection, doc} from 'firebase/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile, useDownloadURL} from 'react-firebase-hooks/storage';
import {useCollectionData} from 'react-firebase-hooks/firestore';

import styles from './styles.module.css';
import emptyAvatar from './images/empty avatar.png';
import {Button} from '@mui/material';
import {styled} from '@mui/system';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";
    margin-bottom: 20px;

    &:hover:not(:disabled) {
        background-color: #464646;
        color: #F4F3F3;
    }     

    &:disabled {
        background-color: rgb(46, 46, 46);
        color: rgb(100, 100, 100);
    }
`

//TODO: i managed to create a link between the users personal storage(videos) and the users personal firestore
// the firestore will contain the url's of the videos in the storage
// now i need to iterate through the firestore collection and display all the urls in video tags
function AccountPage() {
    const [video, setVideo] = useState([]);
    const [user] = useAuthState(auth);
    const [uploadFile] = useUploadFile(auth);
    //const [downloadURL] = useDownloadURL(auth);
    //const collectionRef = collection(firestore, `${user.uid}`);                                  // collection() returns a reference to a collection
    //const documentRef = doc(collectionRef, "") 

    const handleVideo = (e) => {
        setVideo(e.target.files);
    }

    useEffect(() => {
        if(video.length > 0) {
            const userID = user.uid;
            const ref = storageRef(storage, `/${userID}/${video[0].name}`);    
            uploadFile(ref, video[0]);
        }
    }, [video]);

    return user ? (
        <section>
            <div className={styles.basicInfo}>
                {user.photoURL ? <img src={user.photoURL} className={styles.usersAvatar}/> 
                    : <img src={emptyAvatar} className={styles.usersAvatar}/>}
                <div className={styles.userInfo}>
                    <p className={styles.username}>
                        {user.displayName}
                    </p>
                    <p className={styles.email}>
                        {user.email}
                    </p>                    
                </div>
            </div>
            <div className={styles.videosUploaded}>
                <StyledButton id="outlined-basic" variant="contained" component="label">
                    Upload videos
                    <input type="file" hidden accept="image/*" onChange={handleVideo}/>
                </StyledButton>                
                <h1 className={styles.title}>Your Videos:</h1> 
            </div>
        </section>
    ) : (<>loading</>)
}

export default AccountPage;
