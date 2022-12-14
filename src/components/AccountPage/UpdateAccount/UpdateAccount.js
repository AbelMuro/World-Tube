import React, {useState, useRef, useEffect} from 'react';
import {Button, Dialog, DialogTitle, DialogContent, Stack} from '@mui/material';
import {styled} from '@mui/system';
import {auth, storage, firestore} from '../../Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage'; 
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {doc, setDoc, collection, getDocs, getDoc} from 'firebase/firestore';
import {updateProfile} from 'firebase/auth';
import styles from './styles.module.css';
import UploadImage from './UploadImage';
import TextFields from './TextFields';
import {CircularProgress} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';


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
const DialogButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";
    width: 70%; 
    margin: auto; 
    display: block;

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     
`


function UpdateAccount({forceRender}) {
    const mobile = useMediaQuery("(max-width: 525px)");
    const mobileDialog = useMediaQuery("(max-width: 400px)");
    const [open, setOpen] = useState(false);
    const image = useRef();
    const textFields = useRef();
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [openUsernameAlreadyExistsDialog, setOpenUsernameAlreadyExistsDialog] = useState(false);
    const [uploadFile] = useUploadFile();

    const handleOpen = () => {
        setOpen((prevState) => {
            return !prevState;
        });
    }

    const closeUsernameAlreadyExistsDialog = () => {
        setOpenUsernameAlreadyExistsDialog(false);
    }

    const submit = async () => {
        try{
            setLoading(true);
            const username = textFields.current.username.value;
            const aboutMe = textFields.current.aboutMe.value;
            const [imageFile] = image.current.files;
            let url = null;

            if(username){
                const devsDocRef = doc(firestore, `developers collection/userInfo`); 
                const devsDoc = await getDoc(devsDocRef); 
                const allUsernames = devsDoc.data().allUsernames;
                const oldUsername = user.displayName;
                //if the new username already exists in the database, then we throw an error
                for(let currentUsername in allUsernames){
                    const users = allUsernames[currentUsername].username;
                    if(users == username)
                        throw {message: "username already exists"}  
                }  
                //we then delete the old username from the database, and add the new one
                const updatedUsernames = allUsernames.filter((user) => {
                    const currentUsername = user.username;
                    if(currentUsername == oldUsername)
                        return false;
                    else
                        return true;
                })         
                updatedUsernames.push({username: username});
                await setDoc(devsDocRef, {
                    allUsernames: updatedUsernames,
                })                    
            }

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

            //we add a document containing the about-me section of the account and the url image of the user
            if(aboutMe || url){
                const docRef = doc(firestore, `${user.uid}/userInfo`);                  
                await setDoc(docRef, {
                    ...(aboutMe && {aboutMe: aboutMe}),
                    ...(url && {imageURL: url}),
                }, {merge: true})                
            } 

            //updating all the video documents that contain user info
            if(username || url){
                const newDocFields = {
                    ...(username && {username: username}),
                    ...(url && {userImage: url}),
                }
                //updating the username and image in the users personal collection
                const collectionRef = collection(firestore, `${user.uid}`);
                const allUsersVideos = await getDocs(collectionRef);
                allUsersVideos.forEach((video) => {
                    if(video.id != "userInfo") {
                        const videoData = video.data();
                        //updating username and image for every video document
                        const currentVideo = doc(firestore, `${user.uid}/${videoData.videoID}`)                
                        setDoc(currentVideo, newDocFields, {merge: true}); 
                    }
                })
                //updating username and image for every comment posted (if the user hasnt posted any comments. then nothing will happen)
                const commentSectionRef = collection(firestore, `${user.uid}/userInfo/allComments`);   
                getDocs(commentSectionRef)
                    .then((allComments) => {
                        allComments.forEach((comment) => {
                            const commentData = comment.data();
                            const commentRef = doc(firestore, `${commentData.videoOwnerID}/${commentData.videoID}/commentSection/${commentData.commentID}`);
                            setDoc(commentRef, newDocFields, {merge: true});                       
                        })                                
                    })
                //updating username and image for every reply made by this user (if the user hasnt made any replies, then nothing will happen)
                const commentRepliesRef = collection(firestore, `${user.uid}/userInfo/allReplies`);
                getDocs(commentRepliesRef)
                    .then((allReplies) => {
                        allReplies.forEach((reply) => {
                            const replyData = reply.data();
                            const replyRef = doc(firestore,`${replyData.videoOwnerID}/${replyData.videoID}/commentSection/${replyData.commentID}/commentReplies/${replyData.replyID}`);
                            setDoc(replyRef, newDocFields, {merge: true});
                        })
                    })
                //updating the username and image in the developers collection
                const devCollectionRef = collection(firestore, "developers collection/allVideos/videoCollection");
                const allDevVideos = await getDocs(devCollectionRef);
                allDevVideos.forEach((video) => {
                    const videoData = video.data();
                    if(videoData.userID == user.uid){
                        const currentVideo = doc(devCollectionRef, `${videoData.videoID}`);
                        setDoc(currentVideo, newDocFields, {merge: true});                        
                    }
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
            if(error.message == "username already exists") {
                setOpenUsernameAlreadyExistsDialog(true);
            }
            console.log(error.message);
        }
    }
 

    return(
        <>
            <StyledButton variant="contained" onClick={handleOpen} sx={(mobile ? {width: "90%"} : {})}> 
                Update Account
            </StyledButton> : 
            <Dialog open={open}>
                {loading ? <div className={styles.loading}><CircularProgress/></div> :
                <DialogContent className={styles.dialog}>
                    <DialogTitle className={styles.title}>
                        Update Account Info
                    </DialogTitle>
                    <UploadImage ref={image}/>

                    <Stack spacing={2}  sx={(mobileDialog ? {width: "250px"} : {})}>
                        <TextFields ref={textFields} />                        
                        <ReverseStyledButton variant="contained" onClick={submit} sx={(mobileDialog ? {width: "250px"} : {})}>
                            Submit
                        </ReverseStyledButton>
                        <ReverseStyledButton variant="contained" onClick={handleOpen} sx={(mobileDialog ? {width: "250px"} : {})}>
                            Close
                        </ReverseStyledButton>
                    </Stack>
                </DialogContent>}
            </Dialog>
            <Dialog open={openUsernameAlreadyExistsDialog}>
                <DialogContent className={styles.dialogContent}>
                    <DialogTitle className={styles.dialogTitle} style={{textAlign: "center"}}>
                        Username already exists
                    </DialogTitle>
                    <DialogButton variant="contained" onClick={closeUsernameAlreadyExistsDialog}>
                        OK
                    </DialogButton>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UpdateAccount;