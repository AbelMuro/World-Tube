import React, {useState} from 'react';
import {Select, MenuItem, InputLabel, 
       FormControl,Dialog, DialogTitle, 
       Stack, Button, TextField, CircularProgress} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';

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

const ReverseStyledButton = styled(Button)`
    background-color: #464646;
    color: #F4F3F3;
    font-family: "crimson text";
    margin-bottom: 20px;

    &:hover:not(:disabled) {
        background-color:#F4F3F3;
        color: #464646;
    }     
`


function Popup({category, setCategory, title, setTitle ,handleVideo, loading, setLoading, open, setOpen}) {

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCategory = (e) => {
        setCategory(e.target.value);
    }

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleClick = (e) => {
        if(title == "") {
            alert("Please enter a title");
            e.preventDefault;
        }
        else if(category == ""){
            alert("Please select a category");
            e.preventDefault;
        }
    } 

    const uploadVideo = (e) => {
        const files = e.target.files;
        setLoading(true);
        handleVideo(files);
    }

    return(
    <>
        <StyledButton id="outlined-basic" variant="contained" component="label" onClick={handleOpen}>
            Upload videos
        </StyledButton>
        <Dialog open={open} onClose={handleClose}>
            {loading ? 
            <div className={styles.loading}>
                <CircularProgress />
            </div> : 
            <>
                <DialogTitle sx={{textAlign: "center", margin: "10px 120px"}}>
                    Enter data about the video
                </DialogTitle>
                <Stack spacing={2} sx={{margin: "10px 120px", marginBottom: "40px"}}>
                    <TextField id="outlined-basic" label="Enter Title" value={title} onChange={handleTitle} required/>

                    <FormControl>
                        <InputLabel id={"selectCategory"}>Select Category</InputLabel>
                        <Select labelId="selectCategory" label={"Select Category"} value={category} onChange={handleCategory}>
                            <MenuItem value="Funny">Funny</MenuItem>
                            <MenuItem value="Music">Music</MenuItem>
                            <MenuItem value="Sports">Sports</MenuItem>
                            <MenuItem value="News">News</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>      
                    </FormControl>    

                    <ReverseStyledButton variant="contained" component="label" onClick={handleClick}>
                        Select Video
                        {(title && category) ? <input type="file" hidden accept="video/*" onChange={uploadVideo} /> : <></>}
                    </ReverseStyledButton>     
                    <ReverseStyledButton variant="contained" onClick={handleClose}>
                        Close 
                    </ReverseStyledButton>                       
                </Stack>
            </> 
            }
        </Dialog>    
    </>
        

    )
}

export default Popup;