import React, {useState} from 'react';
import {Stack, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {firestore, auth} from '~/components/Firebase-config';
import {setDoc, doc} from 'firebase/firestore';
import {v4 as uuid} from 'uuid';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useMediaQuery} from '@mui/material';

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
    const mobile = useMediaQuery("(max-width: 1100px)");

    const handleComment = (e) => {
        if(e.target.value.length < 300)
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
        const commentRef = doc(firestore, `${user.uid}`, `userInfo/allComments/${commentID}`);
        const documentRef = doc(firestore, `${videoOwnerID}`, `${videoID}/commentSection/${commentID}`);
        await setDoc(documentRef, {
            comment: comment,
            commentID : commentID,
            userID: user.uid,
            userImage: user.photoURL,
            username: user.displayName, 
            order: millisecondsSince1970,
            timeStamp: `${readableDate} ${currentHour}:${currentMinutes} ${AmOrPm}`,
            videoOwnerID: videoOwnerID,
            videoID: videoID,  
        })
        await setDoc(commentRef, {
            videoOwnerID: videoOwnerID,
            videoID: videoID,
            commentID: commentID
        })
        setComment("");
    }


    return(                
    <div>
        <Stack spacing={2} sx={(mobile ? {width: "90%", margin: "auto"} : {})}>
            <TextField id="outlined-basic" label="Enter a comment" multiline rows={4} value={comment} onChange={handleComment}/>
            <StyledButton variant="contained" onClick={submitComment} sx={{marginBottom: "20px"}}>
                Submit Comment
            </StyledButton>
        </Stack>
    </div>   )
}

export default CommentBox;