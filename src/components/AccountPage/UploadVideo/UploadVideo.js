import React, {useState, useEffect} from 'react';
import {Select, MenuItem, InputLabel, 
       FormControl,Dialog, DialogTitle, DialogContent, 
       Stack, Button, TextField} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';
import {storage, firestore, auth} from '../../Firebase-config';
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {setDoc, doc} from 'firebase/firestore';
import {useUploadFile} from 'react-firebase-hooks/storage';
import {useDispatch, useSelector} from 'react-redux';

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

function UploadVideo({user}) {
    const loadingState = useSelector((state) => state.loadingState)
    const dispatch = useDispatch();
    const [video, setVideo] = useState([]);
    const [uploadFile] = useUploadFile(auth);
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    let disable = loadingState;

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

    const handleSubmit = async () => {

        if(video.length == 0){
            alert("Please select a video");
            return;
        }
        if(title == "") {
            alert("Please enter a title");
            return;
        }
        if(category == ""){
            alert("Please select a category");
            return;
        }

        try{
            //setLoading(true);
            //dispatch({type: "loading start"});

            //TODO: learn about the offscreen canvas

            const videoElement = document.createElement("video");
            videoElement.setAttribute("class", styles.offScreenVideo);
            const sourceElement = document.createElement("source");
            sourceElement.setAttribute("src", URL.createObjectURL(video[0]) + "#t=5");            
            const dimensions = videoElement.getBoundingClientRect()
            const canvas = new OffscreenCanvas(dimensions.width, dimensions.height);             
            const context = canvas.getContext("2d"); 
            context.drawImage(videoElement, 0, 0, dimensions.width, dimensions.height);
            const imageURL = canvas.convertToBlob();
            console.log(imageURL);
            //const img = document.querySelector("." + styles.img);
            //img.setAttribute("src", imageURL);


            //using a canvas to create a thumbnail from the video being uploaded
            //const videoRef = document.querySelector("." + styles.video);
            //const dimensions = videoRef.getBoundingClientRect();        
            //const canvas = document.createElement("canvas");
            //canvas.setAttribute("width", dimensions.width);
            //canvas.setAttribute("height", dimensions.height);
            //const context = canvas.getContext("2d");
            //context.drawImage(videoRef, 0, 0, dimensions.width, dimensions.height);
            //const imageURL = canvas.toDataURL("image/png"); 


            return;

            //creating a date object and formatting it
            const currentDate = new Date();
            const millisecondsSince1970 = currentDate.getTime();
            const readableDate = currentDate.toLocaleDateString();
            const currentHour = ((currentDate.getHours() + 11) % 12 + 1);
            let currentMinutes = currentDate.getMinutes();
            currentMinutes = currentMinutes.toString().length == 1 ? `0${currentMinutes}` : currentMinutes;
            const AmOrPm = currentDate.getHours() >= 12 ? "PM" : "AM";
            //uploading the video onto the storage and then getting the URL of that video
            const ref = storageRef(storage, `/${user.uid}/${video[0].name}`);  
            let {metadata} = await uploadFile(ref, video[0]);      
            let url = await getDownloadURL(ref); //getting the url of the video in the storage                           
            const videoID = metadata.md5Hash.replace("/", "");
            //referencing two collections, the users personal collection and the developers collection
            const usersDocument = doc(firestore,`${user.uid}`, `${videoID}`);
            const developersDocument = doc(firestore, "developers collection", `allVideos/videoCollection/${videoID}`);
            //creating an object that contains all the meta data of the video being uploaded
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
                thumbnail: imageURL,
                resolution: videoRef.videoHeight
            }
            //storing the object into the firestore
            await setDoc(usersDocument, videoData)
            await setDoc(developersDocument, videoData)
            setLoading(false);
            dispatch({type: "loading stop"}); 
            setOpen(false); 
            setCategory("");
            setTitle("");            
        }
        catch(error){
            console.log(error);
            setLoading(false);
            dispatch({type: "loading stop"}); 
            setOpen(false); 
            setCategory("");
            setTitle("");  
        }
    }

    //TODO: find a way to improve the quality of the thumbnail by increasing the size of the videoo tag
    useEffect(() => {
        if(video.length == 0) return;
        
        const videoElement = document.createElement("video");
        videoElement.setAttribute("class", styles.video);
        const sourceElement = document.createElement("source");
        sourceElement.setAttribute("size", 1080);
        sourceElement.setAttribute("src",URL.createObjectURL(video[0]) + "#t=5");
        videoElement.appendChild(sourceElement);
        const videoContainer = document.querySelector("." + styles.videoContainer);
        if(videoContainer.firstElementChild) videoContainer.removeChild(videoContainer.firstElementChild)
        videoContainer.appendChild(videoElement);

    },[video])

    return(
    <>
        <StyledButton id="outlined-basic" variant="contained" component="label" onClick={handleOpen} disabled={disable}>
            Upload videos
        </StyledButton>
        <Dialog open={open} onClose={handleClose}>
            {loading ? 
            <DialogContent sx={{padding: "50px"}}>
                <Stack spacing={2} sx={{width: "300px"}}>
                    <p className={styles.loadingTitle}>
                        Video is being uploaded, which may take some time.
                        You can close this popup window and check the progress of the 
                        video in your account page. But do NOT close the application 
                        or the browser tab.
                    </p>
                    <StyledButton variant="contained" onClick={handleClose}>
                        Close
                    </StyledButton>
                </Stack>                
            </DialogContent>
            : 
            <DialogContent>
                <DialogTitle sx={{textAlign: "center"}}>
                    Enter data about the video
                </DialogTitle>
                <Stack spacing={2} sx={{marginTop: "10px"}}>
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

                    <ReverseStyledButton variant="contained" component="label">
                        Upload Video
                        <input type="file" hidden accept="video/*" onChange={handleVideo} />
                    </ReverseStyledButton>                   
                    <div className={styles.videoContainer}></div> 
                    <img className={styles.img}/>
                    <ReverseStyledButton variant="contained" onClick={handleSubmit} >
                        Submit
                    </ReverseStyledButton>
                    <ReverseStyledButton variant="contained" onClick={handleClose}>
                        Close 
                    </ReverseStyledButton>                       
                </Stack>
            </DialogContent> 
            }
        </Dialog>    
    </>
        

    )
}

export default UploadVideo;