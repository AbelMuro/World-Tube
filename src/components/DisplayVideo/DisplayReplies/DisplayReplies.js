import React, {useState, memo} from 'react';
import {firestore, auth} from '../../Firebase-config';
import {collection, query, orderBy} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid'
import {CircularProgress, Button} from '@mui/material';
import {styled} from '@mui/system';
import DialogPopup from './DialogPopup';

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

function DisplayReplies({userID, videoID, commentID}){
    const [user] = useAuthState(auth);
    const commentReplyCollection = collection(firestore, `${userID}/${videoID}/commentSection/${commentID}/commentReplies`);
    const q = query(commentReplyCollection, orderBy("order", "desc"))
    const [allReplies, loadingReplies] = useCollectionData(q);


    return( loadingReplies ? <div className={styles.loading}><CircularProgress/></div> : 
        <div className={styles.commentReplies}> 
            {allReplies.map((replyComment) => {
                const image = replyComment.userImage;
                const comment = replyComment.comment;
                const username = replyComment.username;
                const timeStamp = replyComment.timeStamp
                const commentReplyID = replyComment.commentID;
                const usersReplyID = replyComment.userID;               //usersReplyID is used to compare with the users ID

                return (
                <div className={styles.reply} key={uuid()}>
                    <div className={styles.userInfo}>
                        <img src={image} className={styles.userImage}/>                        
                        <p className={styles.username}>
                            {username}
                        </p>
                    </div>
                    <p className={styles.timeStamp}>
                        {timeStamp}
                    </p>
                    <p className={styles.commentReply}>
                        {comment}   
                    </p>    
                    <DialogPopup usersReplyID={usersReplyID} comment={comment} userID={userID} videoID={videoID} commentID={commentID} commentReplyID={commentReplyID}/>
                </div>)
            })}
        
        </div>
        )
}

export default memo(DisplayReplies);