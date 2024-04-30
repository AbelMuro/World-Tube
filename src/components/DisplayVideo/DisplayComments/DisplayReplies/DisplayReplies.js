import React, {memo} from 'react';
import {firestore} from '../../../Firebase-config';
import {collection, query, orderBy} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid'
import {CircularProgress} from '@mui/material';
import DialogPopup from './DialogPopup';
import UserInfo from './UserInfo';

function DisplayReplies({userID, videoID, commentID}){
    const commentReplyCollection = collection(firestore, `${userID}/${videoID}/commentSection/${commentID}/commentReplies`);
    const q = query(commentReplyCollection, orderBy("order"))
    const [allReplies, loadingReplies] = useCollectionData(q);


    return( loadingReplies ? <div className={styles.loading}><CircularProgress/></div> : 
            allReplies.length == 0 ? <></> :
        <div className={styles.commentReplies}> 
            {allReplies.map((replyComment) => {
                const comment = replyComment.comment;
                const timeStamp = replyComment.timeStamp
                const commentReplyID = replyComment.commentID;
                const commentOwnerID = replyComment.userID;               //usersReplyID is used to compare with the users ID

                return (
                    <div className={styles.reply} key={uuid()}>
                        <UserInfo userID={commentOwnerID }/>
                        <p className={styles.timeStamp}>
                            {timeStamp}
                        </p>
                        <p className={styles.commentReply}>
                            {comment}   
                        </p>    
                        <DialogPopup commentOwnerID={ commentOwnerID} comment={comment} userID={userID} videoID={videoID} commentID={commentID} commentReplyID={commentReplyID}/>
                    </div>)
            })}
        
        </div>
        )
}

export default memo(DisplayReplies);