import React, {useState, useEffect, useRef} from 'react';
import {Button, Dialog, DialogTitle, DialogContent, Stack, TextField} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';
import UploadImage from './UploadImage';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";
    width: 500px; 
    display: block;
    margin: auto;   
    margin-top: 40px;

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     
`
const ReverseStyledButton = styled(Button)`
    background-color: #464646;
    color: #F4F3F3;
    font-family: "crimson text";

    &:hover {
        background-color:#F4F3F3;
        color: #464646;
    }     
`



function UpdateAccount() {
    const [open, setOpen] = useState(false);
    const image = useRef();

    const handleOpen = () => {
        setOpen((prevState) => {
            return !prevState;
        });
    }

    const submit = () => {
        console.log(image.current.files);        
    }
 

    return(
        <>
            <StyledButton variant="contained" onClick={handleOpen}>
                Update Account
            </StyledButton>
            <Dialog open={open}>
                <DialogContent className={styles.dialog}>
                    <DialogTitle className={styles.title}>
                        Update Account Info
                    </DialogTitle>
                    <UploadImage ref={image}/>
                    <Stack spacing={2}>

                        {/* TODO: put the textfields below in a separate component with forwardRef*/}
                        <TextField variant="outlined" label="Enter new username" value/>
                        <TextField variant="outlined" label="Enter new email"/>
                        <TextField variant="outlined" label="About me.." rows={6} multiline/>
                        <ReverseStyledButton variant="contained" onClick={submit}>
                            Submit
                        </ReverseStyledButton>
                        <ReverseStyledButton variant="contained" onClick={handleOpen}>
                            Close
                        </ReverseStyledButton>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UpdateAccount;