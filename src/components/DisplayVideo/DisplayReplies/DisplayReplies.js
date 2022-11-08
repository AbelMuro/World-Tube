import React, {memo} from 'react';
import {firestore} from '../../Firebase-config';
import {collection, query, orderBy} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid'
import {CircularProgress} from '@mui/material';


//TODO: create an edit button for each reply 

function DisplayReplies({userID, videoID, commentID}){
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
                </div>)
            })}
        
        </div>
        )
}

export default memo(DisplayReplies);