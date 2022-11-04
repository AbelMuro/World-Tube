import React, {useState} from 'react';
import {Button, TextField,Stack} from '@mui/material';
import {Select, MenuItem, InputLabel, FormControl, Dialog} from '@mui/material';
import {styled} from '@mui/system';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";
    margin-bottom: 20px;

    &:hover:not(:disabled) {
        background-color: #464646;
        color: #F4F3F3;
    }     

    &:disabled {
        background-color: rgb(46, 46, 46);
        color: rgb(100, 100, 100);
    }
`


function Popup() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    //TODO: enter the input MUI components inside the Dialog
    return(
    <>
        <StyledButton id="outlined-basic" variant="contained" component="label" onClick={handleOpen}>
            Upload videos
            {/*<input type="file" hidden accept="video/*" onChange={handleVideo}/>*/}
        </StyledButton>
        <Dialog open={open} onClose={handleClose}>
            it works?
        </Dialog>    
    </>
        

    )
}

export default Popup;