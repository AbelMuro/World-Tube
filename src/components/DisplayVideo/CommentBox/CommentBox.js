import React, {useState} from 'react';
import {Stack, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {firestore, auth} from '../../Firebase-config';
import {setDoc, doc} from 'firebase/firestore';
import {v4 as uuid} from 'uuid';
import {useAuthState} from 'react-firebase-hooks/auth';
import emptyAvatar from './images/empty avatar.png';

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

function CommentBox({videoOwnerID, videoID}) {
    const [comment, setComment] = useState();
    const [user] = useAuthState(auth);

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const submitComment = async () => {
        if(!user) {alert("You must be signed in to post a comment"); return}
        const currentDate = new Date();
        const millisecondsSince1970 = currentDate.getTime();
        const readableDate = currentDate.toLocaleDateString();
        const currentHour = ((currentDate.getHours() + 11) % 12 + 1);
        const currentMinutes = currentDate.getMinutes();
        const AmOrPm = currentDate.getHours() >= 12 ? "PM" : "AM";
        const commentID = uuid();
        const documentRef = doc(firestore, `${videoOwnerID}`, `${videoID}/commentSection/${commentID}`);
        await setDoc(documentRef, {
            comment: comment,
            commentID : commentID,
            userID: user.uid,
            userImage: user.photoURL ? user.photoURL : emptyAvatar,
            username: user.displayName, 
            order: millisecondsSince1970,
            timeStamp: `${readableDate} ${currentHour}:${currentMinutes} ${AmOrPm}`  
        })
        setComment("");
    }


    return(                
    <div>
        <Stack spacing={2}>
            <TextField id="outlined-basic" label="Enter a comment" multiline rows={4} value={comment} onChange={handleComment}/>
            <StyledButton variant="contained" onClick={submitComment} sx={{marginBottom: "20px"}}>
                Submit Comment
            </StyledButton>
        </Stack>
    </div>   )
}

export default CommentBox;