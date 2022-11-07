import React, {useEffect, useState} from 'react';

import {auth, storage, firestore} from '../Firebase-config';
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {setDoc, doc} from 'firebase/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage';

import styles from './styles.module.css';
import emptyAvatar from './images/empty avatar.png';

import DisplayVideos from './DisplayVideos';
import Popup from './Popup';


function AccountPage() {
    const [video, setVideo] = useState([]);
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [user] = useAuthState(auth);
    const [uploadFile] = useUploadFile(auth);

    const handleVideo = (file) => {
        setVideo(file);
    }

    useEffect(() => {
        if(video.length > 0) {
            const userID = user.uid;
            const ref = storageRef(storage, `/${userID}/${video[0].name}`);  

            (async function uploadStorage(){
                try{
                    let {metadata} = await uploadFile(ref, video[0]);                           //uploading the file to the storage
                    let url = await getDownloadURL(ref);                                        //getting the url of the video in the storage
                    let userImage = user.photoURL ? user.photoURL : emptyAvatar;
                    const videoID = metadata.md5Hash.replace("/", "");
                    const usersDocument = doc(firestore,`${user.uid}`, `${videoID}`);
                    const developersDocument = doc(firestore, "developers collection", `${videoID}`);
                    await setDoc(usersDocument, {                                              
                        username: user.displayName,
                        title: title,
                        userImage: userImage,
                        category: category,
                        timeCreated: metadata.timeCreated,
                        url: url,
                        userID: user.uid,
                        videoID: videoID
                    })
                    await setDoc(developersDocument,{
                        username: user.displayName,
                        title: title,
                        userImage: userImage,
                        category: category,
                        timeCreated: metadata.timeCreated,
                        url: url,
                        userID: user.uid,
                        videoID: videoID 
                    })
  
                    setLoading(false); 
                    setOpen(false);             
                }
                catch(error){
                    setLoading(false);
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
                <Popup category={category} setCategory={setCategory} 
                       title={title} setTitle={setTitle} 
                       handleVideo={handleVideo} 
                       loading={loading} setLoading={setLoading}
                       open={open} setOpen={setOpen}/>
                <h1 className={styles.title}>Your Videos:</h1> 
                <DisplayVideos userID={user.uid} firestore={firestore}/>
            </div>
        </section>
    ) : (<>loading</>)
}

export default AccountPage;
