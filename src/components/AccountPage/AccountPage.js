import React, {useEffect, useState} from 'react';

import {auth, storage, firestore} from '../Firebase-config';
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {collection, addDoc} from 'firebase/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage';

import styles from './styles.module.css';
import emptyAvatar from './images/empty avatar.png';

import DisplayVideos from './DisplayVideos';

import {Button, TextField,Stack, Dialog} from '@mui/material';
import {Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import {styled} from '@mui/system';

import Popup from 'reactjs-popup';

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

function AccountPage() {
    const [video, setVideo] = useState([]);
    const [category, setCategory] = useState("")
    const [user] = useAuthState(auth);
    const [uploadFile] = useUploadFile(auth);
    //const [downloadURL] = useDownloadURL(auth);
    //const collectionRef = collection(firestore, `${user.uid}`);                                  
    //const documentRef = doc(collectionRef, "") 

    const handleVideo = (e) => {
        setVideo(e.target.files);
    }

    useEffect(() => {
        if(video.length > 0) {
            const userID = user.uid;
            const ref = storageRef(storage, `/${userID}/${video[0].name}`);  

            (async function uploadStorage(){
                try{
                    let {metadata} = await uploadFile(ref, video[0]);
                    let url = await getDownloadURL(ref);
                    const collectionRef = collection(firestore, `${user.uid}`);
                    const allVideosRef = collection(firestore, "All videos");
                    await addDoc(collectionRef,{
                        name: metadata.name,
                        timeCreated: metadata.timeCreated,
                        url: url
                    });  
                    await addDoc(allVideosRef, {
                        name: user.displayName,
                        timeCreated: metadata.timeCreated,                        
                        url: url,    
                    })                  
                }
                catch(error){
                    console.log(error.message);
                }
            })(); 
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

            <Dialog></Dialog>

            <StyledButton id="outlined-basic" variant="contained" component="label">
                Upload videos
                {/*<input type="file" hidden accept="video/*" onChange={handleVideo}/>*/}
            </StyledButton>
           
            <h1 className={styles.title}>Your Videos:</h1> 
            <DisplayVideos userID={user.uid} firestore={firestore}/>
            </div>
        </section>
    ) : (<>loading</>)
}

export default AccountPage;
