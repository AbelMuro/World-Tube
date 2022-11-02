import React, {useEffect} from 'react';
import {storage} from '../Firebase-config';
import {ref as storageRef} from 'firebase/storage'
import {useDownloadURL} from 'react-firebase-hooks/storage';

function HomePage() {

    const [downloadURL] = useDownloadURL();

    
    useEffect(() => {
        const ref = storageRef(storage, )   
    })

    return(<>home page</>)
}

export default HomePage