import React from 'react';
import {auth, storage, firestore} from '../Firebase-config';
import {collection, doc} from 'firebase/firestore';
import styles from './styles.module.css';

function DisplayVideo() {
    return(
        <section>
            <video className={styles.video}>
                <source src={""} type="video/*"/>
                Your Browser doesn't support videos
            </video>
            <h1></h1>
        </section>
        )
}

export default DisplayVideo;