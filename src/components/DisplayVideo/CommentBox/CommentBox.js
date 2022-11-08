import React, {useState} from 'react';
import {Stack, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';

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

function CommentBox({submitComment}) {
    const [comment, setComment] = useState();

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = () => {
        submitComment(comment);
    }

    return(                
    <div>
        <Stack spacing={2}>
            <TextField id="outlined-basic" label="Enter a comment" multiline rows={4} value={comment} onChange={handleComment}/>
            <StyledButton variant="contained" onClick={handleSubmit} sx={{marginBottom: "20px"}}>
                Submit Comment
            </StyledButton>
        </Stack>
    </div>   )
}

export default CommentBox;