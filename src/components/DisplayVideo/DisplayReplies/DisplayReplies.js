import React, {memo} from 'react';
import {collection,} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid'

function DisplayReplies({userID, videoID, commentID, firestore}){
    const commentReplyCollection = collection(firestore, `${userID}/${videoID}/commentSection/${commentID}/commentReplies`);
    const [allReplies, loadingReplies] = useCollectionData(commentReplyCollection);

    return( loadingReplies ? <>loading</> : 
        <> 
            {allReplies.map((replyComment) => {
                return (<div className={styles.reply} key={uuid()}>
                    {replyComment.comment}
                </div>)
            })}
        
        </>
        )
}

export default memo(DisplayReplies);