import React, {useState, memo} from 'react';
import {auth, firestore} from '../../../Firebase-config';
import {setDoc, doc} from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Dialog, DialogTitle, DialogContent, Button, Stack, TextField} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';
import {v4 as uuid} from 'uuid';
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


function Dialogs({videoOwnerID, videoID, commentOwnerID ,commentID, comment}) {
    const [reply, setReply] = useState("");
    const [edit, setEdit] = useState(comment);
    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [user] = useAuthState(auth);

    const handleReplyDialog = () => {
        setOpenReplyDialog((prevState) => {
            return !prevState;
        });
    }

    const sendReply = async () => {
        const currentDate = new Date();
        const millisecondsSince1970 = currentDate.getTime();
        const readableDate = currentDate.toLocaleDateString();
        const currentHour = ((currentDate.getHours() + 11) % 12 + 1);
        const currentMinutes = currentDate.getMinutes();
        const AmOrPm = currentDate.getHours() >= 12 ? "PM" : "AM";
        const nestedCommentID = uuid();
        const commentRef = doc(firestore,`${videoOwnerID}`, `${videoID}/commentSection/${commentID}/commentReplies/${nestedCommentID}`)
        await setDoc(commentRef,{
            comment: reply,
            commentID: nestedCommentID,
            userID: user.uid,
            userImage: user.photoURL ? user.photoURL : emptyAvatar,
            username: user.displayName,
            timeStamp: `${readableDate} ${currentHour}:${currentMinutes} ${AmOrPm}`,
            order: millisecondsSince1970
        })  
        setReply("");
        handleReplyDialog();         
    }


    const handleReplies = (e) => {
        setReply(e.target.value);
    }


    const handleEditDialog = () => {
        setOpenEditDialog((prevState) => {
            return !prevState;
        })
    }


    const handleEdits = (e) => {
        setEdit(e.target.value);
    }

    const sendEdits = async () => {
        const currentDate = new Date();
        const readableDate = currentDate.toLocaleDateString();
        const currentHour = ((currentDate.getHours() + 11) % 12 + 1);
        let temp = currentDate.getMinutes();
        const currentMinutes = temp.toString().length == 1 ? `0${temp}` : temp;
        const AmOrPm = currentDate.getHours() >= 12 ? "PM" : "AM";
        const commentRef = doc(firestore,`${videoOwnerID}`, `${videoID}/commentSection/${commentID}`);
        await setDoc(commentRef, {
            comment: edit,
            timeStamp: `EDITED ON: ${readableDate} ${currentHour}:${currentMinutes} ${AmOrPm}`
        }, {merge: true});
    }

    return( 
        <>
        <Stack spacing={2} direction="row" sx={{position: "absolute", right: "10px", top: "70px"}}>
            <StyledButton variant="contained" sx={{width: "46px", height: "30px"}} onClick={handleReplyDialog}>
                Reply
            </StyledButton>
            {(user.uid == commentOwnerID) ? <StyledButton variant="contained" sx={{width: "46px", height: "30px"}} onClick={handleEditDialog}>
                Edit
            </StyledButton>: <></>}
        </Stack>  
        <Dialog open={openReplyDialog} >
            <DialogTitle sx={{textAlign: "center"}}>
                Reply To Comment
            </DialogTitle>
            <DialogContent sx={{padding: "20px"}}>        
                <Stack spacing={2}>
                    <p className={styles.comment}>
                        {comment}
                    </p>
                    <TextField variant="outlined" multiline rows={4} sx={{width: "400px"}} value={reply} onChange={handleReplies}/>
                    <StyledButton variant="outline-basic" onClick={sendReply}>
                        Submit
                    </StyledButton>
                    <StyledButton variant="outline-basic" onClick={handleReplyDialog}>
                        Close
                    </StyledButton>
                </Stack>
            </DialogContent>
        </Dialog>

       <Dialog open={openEditDialog} >
            <DialogTitle sx={{textAlign: "center"}}>
                Edit Comment
            </DialogTitle>
            <DialogContent sx={{padding: "20px"}}>     
                <Stack spacing={2}>
                    <TextField variant="outlined" value={edit} onChange={handleEdits} multiline rows={4} sx={{width: "400px"}}/>
                    <StyledButton variant="outline-basic" onClick={sendEdits}>
                        Submit
                    </StyledButton>
                    <StyledButton variant="outline-basic" onClick={handleEditDialog}>
                        Close
                    </StyledButton>
                </Stack>
            </DialogContent>
            </Dialog>     
        </>
    )
}

export default memo(Dialogs);