import React, { useEffect, useState } from 'react';
import {auth, firestore} from '../Firebase-config';
import {collection, doc, setDoc} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import styles from './styles.module.css';
import {TextField, Button, Stack, CircularProgress} from '@mui/material';
import {styled} from '@mui/system';
import Video from './Video';                    //i've memoized the Video to prevent it from constantly re-rendering in the controlled component
import {v4 as uuid} from 'uuid';
import emptyAvatar from './images/empty avatar.png';
import DisplayReplies from './DIsplayReplies';
import Dialogs from './Dialogs';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover:not(:disabled) {
        background-color: #464646;
        color: #F4F3F3;
    }     

    &:disabled {
        background-color: rgb(46, 46, 46);
        color: rgb(100, 100, 100);
    }
`
//How the comment section works;
//when the user clicks on reply or edit, 
//it will can an event handler that will access
//all the data from the comment itself
//and will store the data into state objects
//then.. a dialog popup will appear and access
//the state objects and display them

function DisplayVideo() {
    const [comment, setComment] = useState("");
    const [commentID, setCommentID] = useState("");
    const [commentForDialog, setCommentForDialog] = useState("");
    const [reply, setReply] = useState("");
    let videoData = localStorage.getItem("video");
    videoData = JSON.parse(videoData);
    const commentCollection = collection(firestore, `${videoData.userID}/${videoData.videoID}/commentSection`);
    const [allComments, loadingComments] = useCollectionData(commentCollection);
    const [user, loadingUser] = useAuthState(auth);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openReplyDialog, setOpenReplyDialog] = useState(false);

    const closeEditDialog = () => {
        setOpenEditDialog(false);
    }

    const closeReplyDialog = () => {
        setOpenReplyDialog(false)
    }

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const changeReply = (e) => {
        setReply(e.target.value);
    }


    const handleEditDialog = (e) => {
        const commentContainer = e.target.parentElement.parentElement.parentElement;
        const commentIdentification = commentContainer.getAttribute("id");
        const commentToEdit = commentContainer.querySelector("." + styles.comment).innerHTML
        setCommentID(commentIdentification);
        setCommentForDialog(commentToEdit);
        setOpenEditDialog(true);
    }

    //TODO: theres a few more things i have to change here, rememeber that commentCOntainer has two nexted elements, one has all the comment info, and the other is emppty
    const handleReplyDialog = (e) => {
        const commentContainer = e.target.parentElement.parentElement.parentElement;  
        const commentIdentification = commentContainer.getAttribute("id");
        const commentToReply = commentContainer.querySelector("." + styles.comment).innerHTML;
        setCommentID(commentIdentification);
        setCommentForDialog(commentToReply);
        setOpenReplyDialog(true);
    }

    const handleReply = async (commentReply) => {
        const nestedCommentID = uuid();
        const commentRef = doc(firestore,`${videoData.userID}`, `${videoData.videoID}/commentSection/${commentID}/commentReplies/${nestedCommentID}`)
        await setDoc(commentRef,{
            comment: commentReply,
            commentID: nestedCommentID,
            userID: user.uid,
            userImage: user.photoURL ? user.photoURL : emptyAvatar,
            username: user.displayName,
        })           
    }

    const handleEdit = () => {

    }

    const submitComment = async () => {
        if(!user) {alert("You must be signed in to post a comment"); return}

        const userID = videoData.userID;
        const videoID = videoData.videoID;
        const commentID = uuid();
        const documentRef = doc(firestore, userID, `${videoID}/commentSection/${commentID}`);
        await setDoc(documentRef, {
            comment: comment,
            commentID : commentID,
            userID: user.uid,
            userImage: user.photoURL ? user.photoURL : emptyAvatar,
            username: user.displayName,   
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
                        <StyledButton variant="contained" onClick={submitComment} sx={{marginBottom: "20px"}}>
                            Submit Comment
                        </StyledButton>
                    </Stack>
                </div>               
                <div className={styles.displayComments}>
                    {(loadingComments) ? <div className={styles.loadingCircle}><CircularProgress /></div> : allComments.map((comment) => {
                            
                            return (
                                <div id={comment.commentID} className={styles.commentContainer} key={uuid()} >  
                                    <div className={styles.nestedFlex}>
                                        <p className={styles.username}> 
                                            <img src={comment.userImage} className={styles.userImage}/>
                                            {comment.username}
                                        </p>
                                        <p className={styles.comment}>
                                            {comment.comment}
                                        </p>
                                        <Stack spacing={2} direction="row" sx={{position: "absolute", right: "10px", top: "70px"}}>
                                            <StyledButton variant="contained" sx={{width: "46px", height: "30px"}} onClick={handleReplyDialog}>
                                                Reply
                                            </StyledButton>
                                            {(user.uid == comment.userID) ? <StyledButton variant="contained" sx={{width: "46px", height: "30px"}} onClick={handleEditDialog}>
                                                Edit
                                            </StyledButton>: <></>}
                                        </Stack>                      
                                    </div>         
                                    <div className={styles.commentReplies}>
                                        <DisplayReplies userID={videoData.userID} videoID={videoData.videoID} commentID={comment.commentID} firestore={firestore}/>                 
                                    </div>      
  
                                    <Dialogs commentForDialog={commentForDialog} openReplyDialog={openReplyDialog} 
                                     openEditDialog={openEditDialog}  handleReply={handleReply} handleEdit={handleEdit}
                                    closeEditDialog={closeEditDialog} closeReplyDialog={closeReplyDialog}/>
                                    
                                    

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