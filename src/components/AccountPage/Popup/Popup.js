import React, {useState, useEffect} from 'react';
import {Select, MenuItem, InputLabel, 
       FormControl,Dialog, DialogTitle, 
       Stack, Button, TextField, CircularProgress} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';
import {storage, firestore, auth} from '../../Firebase-config';
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {setDoc, doc} from 'firebase/firestore';
import {useUploadFile} from 'react-firebase-hooks/storage';

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


function Popup({user}) {
    const [video, setVideo] = useState([]);
    const [uploadFile] = useUploadFile(auth);
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");


    const handleVideo = (e) => {
        setVideo(e.target.files);
    }   

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

    useEffect(() => {
        if(video.length > 0) {
            setLoading(true);
            const userID = user.uid;
            const ref = storageRef(storage, `/${userID}/${video[0].name}`);  

            (async function uploadStorage(){
                try{
                    const currentDate = new Date();
                    const millisecondsSince1970 = currentDate.getTime();
                    const readableDate = currentDate.toLocaleDateString();
                    const currentHour = ((currentDate.getHours() + 11) % 12 + 1);
                    let currentMinutes = currentDate.getMinutes();
                    currentMinutes = currentMinutes.toString().length == 1 ? `0${currentMinutes}` : currentMinutes;
                    const AmOrPm = currentDate.getHours() >= 12 ? "PM" : "AM";
                    let {metadata} = await uploadFile(ref, video[0]);                           //uploading the file to the storage
                    let url = await getDownloadURL(ref);                                        //getting the url of the video in the storage
                    const videoID = metadata.md5Hash.replace("/", "");
                    const usersDocument = doc(firestore,`${user.uid}`, `${videoID}`);
                    const developersDocument = doc(firestore, "developers collection", `allVideos/videoCollection/${videoID}`);
                    const videoData = {                                              
                        username: user.displayName,
                        title: title,
                        searchTitle: title.toLowerCase(),
                        userImage: user.photoURL,
                        category: category,
                        timeCreated: `${readableDate} ${currentHour}:${currentMinutes} ${AmOrPm}`,
                        url: url,
                        userID: user.uid,
                        videoID: videoID,
                        order: millisecondsSince1970,
                    }
                    await setDoc(usersDocument, videoData)
                    await setDoc(developersDocument, videoData)
                    setLoading(false); 
                    setOpen(false);             
                }
                catch(error){
                    setLoading(false);
                    console.log(error.message);
                }
            })(); 
        }
    }, [video]);

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
                        {(title && category) ? <input type="file" hidden accept="video/*" onChange={handleVideo} /> : <></>}
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