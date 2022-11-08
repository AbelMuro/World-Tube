import React, {useState, memo} from 'react';
import {Dialog, DialogTitle, DialogContent, Button, Stack, TextField} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';

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


function Dialogs({commentForDialog, openReplyDialog,  openEditDialog , handleReply, handleEdit, closeEditDialog, closeReplyDialog}) {
    const [reply, setReply] = useState("");
    const [edit, setEdit] = useState(commentForDialog);

    const handleReplies = (e) => {
        setReply(e.target.value);
    }

    const sendReplies = () => {
        handleReply(reply);
    }


    const handleEdits = (e) => {
        setEdit(e.target.value);
    }

    const sendEdits = () => {
        handleEdit(edit);
    }

    return( 
        <>
        <Dialog open={openReplyDialog} >
            <DialogTitle sx={{textAlign: "center"}}>
                Reply To Comment
            </DialogTitle>
            <DialogContent sx={{padding: "20px"}}>        
                <Stack spacing={2}>
                    <p className={styles.comment}>
                        {commentForDialog}
                    </p>
                    <TextField variant="outlined" multiline rows={4} sx={{width: "400px"}} value={reply} onChange={handleReplies}/>
                    <StyledButton variant="outline-basic" onClick={sendReplies}>
                        Submit
                    </StyledButton>
                    <StyledButton variant="outline-basic" onClick={closeReplyDialog}>
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
                    <TextField variant="outlined" value={edit} onChange={handleEdits} multiline rows={4} sx={{width: "400px"}} inputProps={{id: "editComment"}}/>
                    <StyledButton variant="outline-basic" onClick={sendEdits}>
                        Submit
                    </StyledButton>
                    <StyledButton variant="outline-basic" onClick={closeEditDialog}>
                        Close
                    </StyledButton>
                </Stack>
            </DialogContent>
        </Dialog>        
        </>
    )
}

export default memo(Dialogs);