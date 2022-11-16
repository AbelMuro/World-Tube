import React, {useEffect} from 'react';
import {collection, query, where} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {firestore} from '../Firebase-config';
import styles from './styles.module.css';
import CommentBox from './CommentBox';
import DisplayComments from './DisplayComments';
import {useLocation} from 'react-router-dom';
import {v4 as uuid} from 'uuid';


function DisplayVideo() {
    const data = useLocation();
    const videoData = data.state;
    const collectionRef = collection(firestore, `${videoData.userID}`);
    const q = query(collectionRef, where("title", "!=", `${videoData.title}`));
    const [allUsersVideos, loading] = useCollectionData(collectionRef);
    
    //TODO: also make sure to exclude the userInfo document from the collection above
    //TODO: import navigate hook and pass the video data to the DisplayVideo Component (this component)
    const handleVideoLink = (e) => {
        let videoData = e.target.getAttribute("data-video");
        videoData = JSON.parse(videoData);
        console.log(videoData);
    }


    //using the data from localstorage and place the data in the DOM
    useEffect(() => {
        document.querySelector("." + styles.video).firstChild.src = videoData.URL;
        document.querySelector("." + styles.title).innerHTML = videoData.title;
        document.querySelector("." + styles.timeStamp).lastChild.innerHTML = videoData.timeStamp;
        document.querySelector("." + styles.userImage).src = videoData.userImage;
        document.querySelector("." + styles.username).innerHTML = videoData.username 
    }, [])

    return(
        <section className={styles.flexContainer}>
            <div className={styles.videoContainer}>
                <video className={styles.video} controls>
                    <source src={videoData.url} type="video/mp4"/>
                    Your Browser doesn't support videos
                </video>
                <h1 className={styles.title}></h1>
                <div className={styles.userInfo}>
                    <img className={styles.userImage}/>
                    <p className={styles.username}></p>
                </div>
                <div className={styles.timeStamp}>
                    <p className={styles.timeStampTitle}>
                        Posted on: 
                    </p>
                    <p className={styles.timeCreated}>
                        
                    </p>
                </div>
                <CommentBox videoOwnerID={videoData.userID} videoID={videoData.videoID}/>
                <DisplayComments videoOwnerID={videoData.userID} videoID={videoData.videoID}/>
            </div>    
            <div className={styles.otherVideosByUser}>
                <h1 className={styles.title}>
                    Other videos by {videoData.username}
                </h1>
                <div className={styles.allVideos}>
                    {loading ? <>...is loading</> : allUsersVideos.length > 1 ? allUsersVideos.map((video) => {

                            return (
                                <div className={styles.otherVideoContainer} key={uuid()}>
                                    <a className={styles.videoLink} onClick={handleVideoLink} data-video={JSON.stringify(video)}>
                                        <video className={styles.otherVideos}> {/* TODO: finish up styling the other videos section of this component AND change the names in the comments of the database*/}
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