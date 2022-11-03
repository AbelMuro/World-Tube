import React from 'react';

import {collection} from 'firebase/firestore';
import {ref, getDownloadURL} from 'firebase/storage';

import {useCollectionData} from 'react-firebase-hooks/firestore'


function DisplayVideos({userID, firestore, storage}) {
    const collectionRef = collection(firestore, userID);
    const [videos, loading] = useCollectionData(collectionRef);

    return loading ? (<>loading</>) : (
        <section>
            {
                videos.map((video) => {
                    let storageRef = ref(storage, `/${userID}/${video.name}`);
                    getDownloadURL(storageRef)
                    .then((url) => {
                        console.log(url);
                    })
                })
            }

        </section>
    );
}

export default DisplayVideos;