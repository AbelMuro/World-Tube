import React from 'react';
import {query, collection, orderBy} from 'firebase/firestore';
import {firestore} from '../../Firebase-config';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {CircularProgress} from '@mui/material';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid';
import DisplayReplies from './DisplayReplies';
import ReplyOrEdit from './ReplyOrEdit';

function DisplayComments({videoOwnerID, videoID}){
    const commentCollection = collection(firestore, `${videoOwnerID}/${videoID}/commentSection`);
    const q = query(commentCollection, orderBy("order", "desc"));
    const [allComments, loadingComments] = useCollectionData(q);

    return(                
        <div className={styles.displayComments}>
            {(loadingComments) ? <div className={styles.loadingCircle}><CircularProgress /></div> : allComments.map((comment) => {       
                    return (
                        <div id={comment.commentID} className={styles.commentContainer} key={uuid()} >  
                            <div className={styles.nestedFlex}>
                                <p className={styles.username}> 
                                    <img src={comment.userImage} className={styles.userImage}/>
                                    {comment.username}
                                </p>
                                <p className={[styles.comment, "commentToSelect"].join(" ")}>
                                    {comment.comment}
                                </p>
                                <p className={styles.datePosted}>
                                    {comment.timeStamp}
                                </p>

                                <ReplyOrEdit videoOwnerID={videoOwnerID} videoID={videoID} commentOwnerID={comment.userID} commentID={comment.commentID} comment={comment.comment}/>

                            </div>         
                            <DisplayReplies userID={videoOwnerID} videoID={videoID} commentID={comment.commentID}/>                                                          
                        </div>
                    )
            })}                        
        </div>
    )
}

export default DisplayComments;