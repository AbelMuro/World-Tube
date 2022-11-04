import React, {useEffect, useState} from 'react';

import {auth, storage, firestore} from '../Firebase-config';
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {collection, addDoc} from 'firebase/firestore';

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
    //const [downloadURL] = useDownloadURL(auth);
    //const collectionRef = collection(firestore, `${user.uid}`);                                  
    //const documentRef = doc(collectionRef, "") 

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
                    const collectionRef = collection(firestore, `${user.uid}`);                 //referencing the user personal collection
                    const allVideosRef = collection(firestore, "All videos");                   //referencing the collection that will contain ALL videos
                    await addDoc(collectionRef,{                                                //this collection is the users personal collection
                        name: metadata.name,
                        title: title,
                        category: category,
                        timeCreated: metadata.timeCreated,
                        url: url
                    });  
                    await addDoc(allVideosRef, {                                                //this collection will be used to contain all videos uploaded by all users
                        name: user.displayName,
                        title: title,
                        category: category,
                        timeCreated: metadata.timeCreated,                        
                        url: url,    
                    })    
                    //TODO: when loading is set to false, the popup should close
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
