import React, { useEffect, useState, memo } from 'react';
import {auth, storage, firestore} from '../Firebase-config';
import {collection, doc, setDoc} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import styles from './styles.module.css';
import {TextField, Button, Stack} from '@mui/material';
import {styled} from '@mui/system';
import Video from './Video';                    //i memoized the Video to prevent it from constantly re-rendering in the controlled component
import {v4 as uuid} from 'uuid';

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
//TODO: style the css for the comment boxes for each comment
// then find a way to enable users to reply to comments

function DisplayVideo() {
    const [comment, setComment] = useState("");
    let videoData = localStorage.getItem("video");
    videoData = JSON.parse(videoData);
    const commentCollection = collection(firestore, `${videoData.userID}/${videoData.videoID}/commentSection`);
    const [allComments, loadingComments] = useCollectionData(commentCollection);
    const [user, loadingUser] = useAuthState(auth);


    const handleComment = (e) => {
        setComment(e.target.value);
    }


    const submitComment = async () => {
        if(!user) {alert("You must be signed in to post a comment"); return}

        const userID = videoData.userID;
        const videoID = videoData.videoID;
        const username = videoData.username;
        const userImage = videoData.userImage;
        const documentRef = doc(firestore, userID, `${videoID}/commentSection/${uuid()}`);
        await setDoc(documentRef, {
            comment: comment,
            username: username,
            userImage: userImage,
        })
    }


    //will use the data from localstorage and place the data in the DOM
    useEffect(() => {
        document.querySelector("#mainVideo").firstChild.src = videoData.URL;
        document.querySelector("." + styles.title).innerHTML = videoData.title;
        document.querySelector("." + styles.timeStamp).lastChild.innerHTML = videoData.timeStamp;
        document.querySelector("." + styles.userImage).src = videoData.userImage;
        document.querySelector("." + styles.username).innerHTML = videoData.username 
    }, [])

    return(
        <section className={styles.flexContainer}>
            <div className={styles.videoContainer}>
                <Video />
                <h1 className={styles.title}></h1>
                <div className={styles.userInfo}>
                    <img className={styles.userImage}/>
                    <p className={styles.username}></p>
                </div>
                <div className={styles.timeStamp}>
                    <p className={styles.timeStampTitle}>
                        created 
                    </p>
                    <p className={styles.timeCreated}>
                        
                    </p>
                </div>
                <div className={styles.commentSection}>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic" label="Enter a comment" multiline rows={4} value={comment} onChange={handleComment}/>
                        <StyledButton variant="contained" onClick={submitComment}>
                            Submit Comment
                        </StyledButton>
                    </Stack>
     
                </div>               
                <div className={styles.displayComments}>
                    {(loadingComments) ? <>is loading</> : allComments.map((comment) => {
                            return (
                                <div className={styles.commentContainer} key={uuid()}>
                                    <img src={comment.userImage} className={styles.userImage}/>
                                    <p className={styles.username}>
                                        {comment.username}
                                    </p>
                                    <p>
                                        {comment.comment}
                                    </p>
                                </div>
                            )
                    })}                        
                </div>
            </div>    
            <div className={styles.otherVideosByUser}>

            </div>    
        </section>

        )
}

export default DisplayVideo;