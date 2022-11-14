import React, {useState, useRef} from 'react';
import {Button, Dialog, DialogTitle, DialogContent, Stack} from '@mui/material';
import {styled} from '@mui/system';
import {auth, storage, firestore} from '../../Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage'; 
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import { doc, setDoc, collection, getDocs} from 'firebase/firestore';
import {updateProfile} from 'firebase/auth';
import styles from './styles.module.css';
import UploadImage from './UploadImage';
import TextFields from './TextFields';

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



function UpdateAccount() {
    const [open, setOpen] = useState(false);
    const image = useRef();
    const textFields = useRef();
    const [user] = useAuthState(auth);
    const [uploadFile] = useUploadFile();

    const handleOpen = () => {
        setOpen((prevState) => {
            return !prevState;
        });
    }

    const submit = async () => {
        try{
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

            await updateProfile(user, {
                ...(username && {displayName: username}),
                ...(url && {photoURL: url})
            })  

            //we add a document containing the about-me section of the account
            const docRef = doc(firestore, `${user.uid}/userInfo`);  
            if(aboutMe){
                await setDoc(docRef, {
                    ...(aboutMe && {aboutMe: aboutMe})
                }, {merge: true})                
            } 

            const newDocFields = {
                ...(username && {username: username}),
                ...(url && {userImage: url}),
            }
            
            //updating all the video documents that contain user info
            const collectionRef = collection(firestore, `${user.uid}`);
            const allUsersVideos = await getDocs(collectionRef);
            allUsersVideos.forEach((video) => {
                if(username || url){
                    const currentVideo = doc(firestore, `${user.uid}/${video.id}`)                
                    setDoc(currentVideo, newDocFields, {merge: true});                      
                }
            })

            const devCollectionRef = collection(firestore, "developers collection");
            const allDevDocs = await getDocs(devCollectionRef);
            allDevDocs.forEach((doc) => {
                if(username || url){
                    const currentVideo = doc(firestore, `${user.uid}/${video.id}`);
                    setDoc(currentVideo, newDocFields, {merge: true});    
                }   
            })
        }
        catch(error){
            console.log(error.message);
        }
    }
 

    return(
        <>
            <StyledButton variant="contained" onClick={handleOpen}>
                Update Account
            </StyledButton>
            <Dialog open={open}>
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
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UpdateAccount;