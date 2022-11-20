import React, {useState} from 'react';
import {firestore} from '../Firebase-config';
import {collection, query, where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import styles from './styles.module.css';
import {v4 as uuid} from "uuid";
import {useNavigate, useLocation} from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import {CircularProgress} from '@mui/material';
import {Dialog, DialogTitle, DialogContent, Stack, Button} from '@mui/material';
import {styled} from '@mui/system';
import CookieIcon from '@mui/icons-material/Cookie';
import Cookies from 'js-cookie';

const StyledDialogContent = styled(DialogContent)`
    background-color: #252525;
    color: white;
    font-family: "crimson text";

`

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     

`



function HomePage() {
    const useCookies = Cookies.get("useCookies");
    const [open, setOpen] = useState(useCookies ? false : true);
    const {state} = useLocation();
    const allVideosRef = collection(firestore, "developers collection/allVideos/videoCollection");      
    const q = state ? state?.search ? query(allVideosRef, where("searchTitle", ">=", state.search), where("searchTitle", "<=", state.search + '\uf8ff')) :
                      state.category != "All" ? query(allVideosRef, where("category", "==", state.category)) : query(allVideosRef)
              : query(allVideosRef);
    const [allVideos, loading] = useCollectionData(q);
    const navigate = useNavigate();

    const playVideoOnHover = (e) => {
        e.target.play();
    }   

    const stopVideoOnLeave = (e) => {
        e.target.pause();
    } 

    const videoLoaded = (e) => {
        const loadingBox = e.target.previousElementSibling;
        loadingBox.style.display = "none";
    }

    const handleNavigate = (e) => {
        let videoData = e.target.getAttribute("data-video");
        videoData = JSON.parse(videoData);
        navigate(`/${videoData.title}`, {state: videoData});
    }

    const handleAccept = () => {
        Cookies.set("useCookies", "true");
        setOpen(false);
    }

    const handleDecline = () => {
        Cookies.set("useCookies", "false")
        setOpen(false);
    }

    return(
        <section className={styles.homeContainer}>
            <h1 className={styles.title}>
                Enjoy the selection of videos uploaded by our users!
            </h1>
            <div className={styles.gridContainer}>
                {loading ? <LoadingScreen/> : allVideos.map((video) => {
                    return (
                        <div key={uuid()} data-id={video.videoID} data-user={video.userID}>
           
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingBox}>
                                    <CircularProgress />
                                </div>
                                <video className={styles.video} data-video={JSON.stringify(video)} onClick={handleNavigate} onMouseOver={playVideoOnHover} onMouseLeave={stopVideoOnLeave} onLoadedData={videoLoaded}>
                                    <source src={video.url}/>
                                    Your Browser doesn't support videos
                                </video>                                  
                            </div>
   
                            <h2 className={styles.videoTitle}>
                                {video.title}
                            </h2>    
                            <p className={styles.videoDesc}>
                                <img src={video.userImage} className={styles.userImage}/>
                                <span id={styles.username}>
                                    {video.username} 
                                </span> 
                            </p>   
                            <div className={styles.videoTimeStamp}>
                                Posted on: 
                                <p>
                                    {video.timeCreated}
                                </p>
                            </div>                
                        </div>
                    )
                })}
            </div>
            <Dialog open={open}>
                <StyledDialogContent>
                    <DialogTitle sx={{textAlign: "center"}}>
                        Cookies <CookieIcon fontSize="large"/>
                    </DialogTitle>
                    <Stack spacing={2} sx={{width: "300px"}}>
                        <p>
                            This site uses cookies to store information about your preferences,
                            we respect your privacy and will use the info we got from your search results
                            for marketing purposes.
                        </p>
                        <StyledButton variant="contained" onClick={handleAccept}>
                            Accept
                        </StyledButton>
                        <StyledButton variant="contained" onClick={handleDecline}>
                            Decline
                        </StyledButton>
                    </Stack>

                </StyledDialogContent>

            </Dialog>
        </section>
    )
}

export default HomePage