import React, {useState, useEffect} from 'react';
import {query, collection, orderBy} from 'firebase/firestore';
import {firestore} from '../../Firebase-config';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {CircularProgress} from '@mui/material';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid';
import DisplayReplies from './DisplayReplies';
import ReplyOrEdit from './ReplyOrEdit';
import {useMediaQuery} from '@mui/material';

function DisplayComments({videoOwnerID, videoID}){
    const [showComments, setShowComments] = useState(false) 
    const mobile = useMediaQuery("(max-width: 1100px)");
    const commentCollection = collection(firestore, `${videoOwnerID}/${videoID}/commentSection`);
    const q = query(commentCollection, orderBy("order", "desc"));
    const [allComments, loadingComments] = useCollectionData(q);

    const handleCommentSection = () => {
        const commentSection = document.querySelector("." + styles.displayComments);
        const currentHeight = commentSection.style.height;
        commentSection.style.height = currentHeight == "auto" ? "123px" : "auto";
        setShowComments((prevState) => {
            return !prevState;
        });
    }
    useEffect(() => {
        const commentSection = document.querySelector("." + styles.displayComments);
        if(!mobile){
            commentSection.style.height = "auto";
            setShowComments(true);
        }
        else{
            commentSection.style.height = "123px";
            setShowComments(false);
        }
            
    }, [mobile])

 
    return(                
        <div className={styles.displayComments}>
            {
            mobile ? loadingComments ? ""  : allComments.length > 1 ? <div className={styles.showComments} onClick={handleCommentSection}>{showComments ? "Show less..." : "Show more..."} </div> : "" :
                ""
            }
            {loadingComments ? <div className={styles.loadingCircle}><CircularProgress /></div> : allComments.length > 0 ? allComments.map((comment) => {    
                    return (
                        <div id={comment.commentID} className={styles.commentContainer} key={uuid()}>  
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
            }) : <h1 className={styles.noComments}> No comments yet</h1> }                        
        </div>
    )
}

export default DisplayComments;