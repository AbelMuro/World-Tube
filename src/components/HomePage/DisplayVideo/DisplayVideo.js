import React, {useRef, useState, useEffect} from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';

function DisplayVideo({video}) {
    const [hover, setHover] = useState(false);
    const [play, setPlay] = useState(false);
    const [message, setMessage] = useState(false);
    const [thumbnail, setThumbnail] = useState(true);
    const videoPlayback = useRef();
    const navigate = useNavigate();

    const playVideoOnHover = (e) => {
        e.target.style.zIndex = 1;
        setHover(true);
    }   

    const stopVideoOnLeave = (e) => {
        e.target.style.zIndex = 0;
        setHover(false);
    } 

    const handleNavigate = (e) => {
        navigate(`/${video.title}`, {state: video});
    }

    useEffect(() => {
        if(hover){
            setMessage(true);
            videoPlayback.current = setTimeout(() => {
                setPlay(true);
                setMessage(false);
                setThumbnail(false);
            }, 2000)
        }
        else{         
            setMessage(false);
            setThumbnail(true);
            setPlay(false);
            clearTimeout(videoPlayback.current);
        }
    }, [hover])

    useEffect(() => {
        if(play){
            const video = document.querySelector("." + styles.video);
            video.play()
        }
    }, [play])


    useEffect(() => {

    }, [])

    return(
        <div>     
            <div 
                className={styles.videoContainer} 
                onMouseEnter={playVideoOnHover} 
                onMouseLeave={stopVideoOnLeave} 
                onClick={handleNavigate}>
                    {thumbnail && 
                        <img src={video.thumbnail} className={styles.thumbnail}/>}
                    {play && 
                        <video className={styles.video} muted controls={false}>
                            <source src={video.url}/>
                            Your browser doesn't support videos    
                        </video>}
                    {message && 
                        <p className={styles.keepHovering}>
                            Keep hovering to play..
                        </p>}
            </div>
            <h2 className={styles.videoTitle}>
                {video.title}
            </h2>    
            <UserInfo userID={video.userID}/>
            <div className={styles.videoTimeStamp}>
                Posted on: 
                <p>
                    {video.timeCreated}
                </p>
            </div>                
        </div>
    )
}

export default DisplayVideo;