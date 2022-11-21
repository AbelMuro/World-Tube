import React, {useEffect} from 'react';
import {collection, query, where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {firestore} from '../Firebase-config';
import styles from './styles.module.css';
import CommentBox from './CommentBox';
import DisplayComments from './DisplayComments';
import {useLocation} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {useNavigate} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import Plyr from 'plyr-react';
import './plyr.css';


function DisplayVideo() {
    const {state} = useLocation();
    const videoData = state;
    const collectionRef = collection(firestore, `${videoData.userID}`);
    const q = query(collectionRef, where("title", "!=", `${videoData.title}`));
    const [allUsersVideos, loading] = useCollectionData(q);
    const navigate = useNavigate();

    const plyrProps = {
        source: {type: "video", sources: [{src: videoData.url}]},
        options: [{quality: {default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360]}}]
    }

    const handleVideoLink = (e) => {
        let videoData = e.target.getAttribute("data-video");
        videoData = JSON.parse(videoData);
        navigate(`/${videoData.title}`, {state : videoData});
        window.location.reload(false);
    }

    const handleLoad = (e) => {
        const loadingBlock = e.target.previousElementSibling;
        loadingBlock.style.display = "none";
    }

    return(
        <section className={styles.flexContainer}>
            <div className={styles.videoContainer}>
                <Plyr {...plyrProps} className={["plyr-react plyr", styles.video].join(" ")}/>
                <h1 className={styles.title}>
                    {videoData.title}
                </h1>
                <div className={styles.userInfo}>
                    <img className={styles.userImage} src={videoData.userImage}/>
                    <p className={styles.username}>
                        {videoData.username} 
                    </p>
                </div>
                <div className={styles.timeStamp}>
                    <p className={styles.timeStampTitle}>
                        Posted on: 
                    </p>
                    <p className={styles.timeCreated}>
                        {videoData.timeCreated}
                    </p>
                </div>
                <CommentBox videoOwnerID={videoData.userID} videoID={videoData.videoID}/>
                <DisplayComments videoOwnerID={videoData.userID} videoID={videoData.videoID}/>
            </div>    
            <div className={styles.otherVideosByUser}>
                <h1 className={styles.otherVideosTitle}>
                    Other videos by {videoData.username}
                </h1>
                <div className={styles.allVideos}>
                    {loading ? <div className={styles.loading}><CircularProgress/></div> : allUsersVideos.length >= 1 ? allUsersVideos.map((video) => {
                            return (
                                <div className={styles.otherVideoContainer} key={uuid()}>
                                    <a className={styles.videoLink} onClick={handleVideoLink} data-video={JSON.stringify(video)}>
                                        <div className={styles.loadingVideo}>
                                            <CircularProgress />
                                        </div>
                                        <video className={styles.otherVideos} onLoadedData={handleLoad}>
                                            <source src={video.url}/>
                                            Your Browser doesn't support videos
                                        </video>                                          
                                    </a>
                                    <p className={styles.otherVideoTitle}>
                                        {video.title}   
                                    </p>                              
                                </div>

                            ) 
                        }) : <h2 className={styles.noOtherVideos}>No other videos</h2>
                    }
                </div>
            </div>    
        </section>

        )
}

export default DisplayVideo;