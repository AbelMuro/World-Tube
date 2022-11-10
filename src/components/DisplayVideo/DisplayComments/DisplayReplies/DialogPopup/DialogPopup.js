import React, {useState} from 'react';
import {firestore, auth} from '../../../../Firebase-config'
import {useAuthState} from 'react-firebase-hooks/auth';
import {doc, setDoc} from 'firebase/firestore';
import { Button, Dialog, DialogTitle, DialogContent, Stack, TextField} from '@mui/material';
import {styled} from '@mui/system';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover:not(:disabled) {
        background-color: #464646;
        color: #F4F3F3;
    }     
`

function DialogPopup({ commentOwnerID, comment, userID, videoID, commentID, commentReplyID}) {
    const [user, loading] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(comment);

    const openCloseDialog = () => {
        setOpen((prevState) => {
            return !prevState;
        });
    }

    const handleEdit = (e) => {
        setEdit(e.target.value);
    }

    const submitEdit = async() => {
        const currentDate = new Date();
        const readableDate = currentDate.toLocaleDateString();
        const currentHour = ((currentDate.getHours() + 11) % 12 + 1);
        let temp = currentDate.getMinutes();
        const currentMinutes = (temp.toString().length == 1 ? `0${temp}` : temp );
        const AmOrPm = currentDate.getHours() >= 12 ? "PM" : "AM";
        const docRef = doc(firestore, `${userID}`, `${videoID}/commentSection/${commentID}/commentReplies/${commentReplyID}`);
        await setDoc(docRef,{
            comment: edit,
            timeStamp: `EDITED ON: ${readableDate} ${currentHour}:${currentMinutes} ${AmOrPm}`,
        }, {merge: true})
    }

    return(loading ? <></> :
        <>
            { !user ? <></> :
            user.uid ==  commentOwnerID ? 
            <StyledButton variant="contained" onClick={openCloseDialog} sx={{position: "absolute", right: "10px", bottom: "10px", width: "46px", height: "30px"}}>
                Edit
            </StyledButton> : <></>}

            <Dialog open={open}>
                <DialogTitle>
                    Edit reply
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField variant="outlined" multiline rows={4} value={edit} onChange={handleEdit}/>
                        <StyledButton variant="contained" onClick={submitEdit}>
                            Submit
                        </StyledButton>
                        <StyledButton variant="outlined" onClick={openCloseDialog}>
                            Close
                        </StyledButton>
                    </Stack>
                </DialogContent>
            </Dialog>  
        </>
        )
}

export default DialogPopup;