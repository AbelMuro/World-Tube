import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCui1BCDp8btSWEPzOnk67an2e5VWAih8A",
    authDomain: "world-tube-1de8d.firebaseapp.com",
    projectId: "world-tube-1de8d",
    storageBucket: "world-tube-1de8d.appspot.com",
    messagingSenderId: "400279370588",
    appId: "1:400279370588:web:2662c22bf129e4556f5f99",
    measurementId: "G-VHD8ES0264"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const firestore = getFirestore(app);