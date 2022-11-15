import React, {useState, useRef} from 'react';
import {Button, Dialog, DialogTitle, DialogContent, Stack} from '@mui/material';
import {styled} from '@mui/system';
import {auth, storage, firestore} from '../../Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage'; 
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {doc, setDoc, collection, getDocs} from 'firebase/firestore';
import {updateProfile} from 'firebase/auth';
import styles from './styles.module.css';
import UploadImage from './UploadImage';
import TextFields from './TextFields';
import {CircularProgress, Box} from '@mui/material';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";
    width: 500px; 
    display: block;
    margin: auto;   
    margin-top: 40px;

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     
`
const ReverseStyledButton = styled(Button)`
    background-color: #464646;
    color: #F4F3F3;
    font-family: "crimson text";

    &:hover {
        background-color:#F4F3F3;
        color: #464646;
    }     
`



function UpdateAccount({forceRender}) {
    const [open, setOpen] = useState(false);
    const image = useRef();
    const textFields = useRef();
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [uploadFile] = useUploadFile();

    const handleOpen = () => {
        setOpen((prevState) => {
            return !prevState;
        });
    }

    const submit = async () => {
        try{
            setLoading(true);
            const username = textFields.current.username.value;
            const aboutMe = textFields.current.aboutMe.value;
            const [imageFile] = image.current.files;
            let url = null;

            //we upload the image to the storage and then get the download URL for the image, we then update the profile
            if(imageFile) {
                const ref = storageRef(storage, `${user.uid}/${imageFile.name}`);
                await uploadFile(ref, imageFile);
                url = await getDownloadURL(ref)                
            }

            //we update the data in the auth variable
            await updateProfile(user, {
                ...(username && {displayName: username}),
                ...(url && {photoURL: url}),
            })  

            //we add a document containing the about-me section of the account
            if(aboutMe){
                const docRef = doc(firestore, `${user.uid}/userInfo`);                  
                await setDoc(docRef, {
                    aboutMe: aboutMe
                }, {merge: true})                
            } 

            //updating all the video documents that contain user info
            if(username || url){
                const newDocFields = {
                    ...(username && {username: username}),
                    ...(url && {userImage: url}),
                }
                const collectionRef = collection(firestore, `${user.uid}`);
                const allUsersVideos = await getDocs(collectionRef);
                allUsersVideos.forEach((video) => {
                    if(video.id != "userInfo") {
                        const currentVideo = doc(firestore, `${user.uid}/${video.id}`)                
                        setDoc(currentVideo, newDocFields, {merge: true});                              
                    }
                })
                const devCollectionRef = collection(firestore, "developers collection");
                const allDevVideos = await getDocs(devCollectionRef);
                allDevVideos.forEach((video) => {
                    const currentVideo = doc(firestore, `${user.uid}/${video.id}`);
                    setDoc(currentVideo, newDocFields, {merge: true});     
                })
            }
            setOpen(false);            
            setLoading(false);
            forceRender((prevState) => {
                return prevState + 0.0000001
            });
 
        }
        catch(error){
            setLoading(false);
            console.log(error.message);
        }
    }
 

    return(
        <>
            <StyledButton variant="contained" onClick={handleOpen}>
                Update Account
            </StyledButton>
            <Dialog open={open}>
                {loading ? <div className={styles.loading}><CircularProgress/></div> :
                <DialogContent className={styles.dialog}>
                    <DialogTitle className={styles.title}>
                        Update Account Info
                    </DialogTitle>
                    <UploadImage ref={image}/>

                    <Stack spacing={2}>
                        <TextFields ref={textFields} />                        
                        <ReverseStyledButton variant="contained" onClick={submit}>
                            Submit
                        </ReverseStyledButton>
                        <ReverseStyledButton variant="contained" onClick={handleOpen}>
                            Close
                        </ReverseStyledButton>
                    </Stack>
                </DialogContent>}
            </Dialog>
        </>
    )
}

export default UpdateAccount;