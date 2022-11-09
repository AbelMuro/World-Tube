import React, { useEffect} from 'react';
import styles from './styles.module.css';
import CommentBox from './CommentBox';
import DisplayComments from './DisplayComments';


//How the comment section works;
//when the user clicks on reply or edit, 
//it will can an event handler that will access
//all the data from the comment itself
//and will store the data into state objects
//then.. a dialog popup will appear and access
//the state objects and display them



function DisplayVideo() {
    let videoData = localStorage.getItem("video");
    videoData = JSON.parse(videoData);    

    //will use the data from localstorage and place the data in the DOM
    useEffect(() => {
        document.querySelector("#mainVideo").firstChild.src = videoData.URL;
        document.querySelector("." + styles.title).innerHTML = videoData.title;
        document.querySelector("." + styles.timeStamp).lastChild.innerHTML = videoData.timeStamp;
        document.querySelector("." + styles.userImage).src = videoData.userImage;
        document.querySelector("." + styles.username).innerHTML = videoData.username 
    }, [])

    return(
        <section className={styles.flexContainer}>
            <div className={styles.videoContainer}>
                <video className={styles.video} controls id="mainVideo">
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

            </div>    
        </section>

        )
}

export default DisplayVideo;