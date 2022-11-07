import React from 'react';
import {collection,} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';

function DisplayReplies({userID, videoID, commentID, firestore}){
    const commentReplyCollection = collection(firestore, `${userID}/${videoID}/commentSection/${commentID}/commentReplies`);
    const [allReplies, loadingReplies] = useCollectionData(commentReplyCollection);

    return( loadingReplies ? <>loading</> : 
        <> 
            {allReplies.map((replyComment) => {
                <div className={styles.reply}>
                    {replyComment.comment}
                </div>
            })}
        
        </>
        )
}

export default DisplayReplies;