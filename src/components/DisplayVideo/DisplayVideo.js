import React from 'react';
import styles from './styles.module.css';
import CommentBox from './CommentBox';
import DisplayComments from './DisplayComments';
import {useLocation} from 'react-router-dom';
import OtherVideosByUser from './OtherVideosByUser';
import PlyrVideo from './PlyrVideo';
import UserInfo from './UserInfo';

function DisplayVideo() {
    const {state} = useLocation();
    const videoData = state;
    const allResolutions = [240, 360, 480, 720, 1080];
    const availableResolutions = allResolutions.map((resolution) => {
                                    if(videoData.resolution >= resolution)
                                        return {src: videoData.url, size: resolution};
                                })
    const plyrProps = {
        source: {type: "video", sources: availableResolutions},
        options: {autoplay: true}
    }

    return(
        <section className={styles.flexContainer}>
            <div className={styles.videoContainer}>
                <PlyrVideo {...plyrProps} isHeightBiggerThanWidth={videoData.isHeightBiggerThanWidth}/>                    
                <h1 className={styles.title}>
                    {videoData.title}
                </h1>
                <UserInfo userID={videoData.userID}/>
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
                <OtherVideosByUser videoData={videoData}/>
            </div>    
        </section>

    )
}

export default DisplayVideo;
