import React, {useState, useRef, useEffect} from 'react';
import {Button, Dialog, DialogTitle, DialogContent, Stack} from '@mui/material';
import {styled} from '@mui/system';
import {auth, storage, firestore} from '../../Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage'; 
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import {doc, updateDoc, collection, getDocs, getDoc} from 'firebase/firestore';
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

            //we upload the image to the storage and then get the download URL for the image, we then update the profile
            if(imageFile) {
                const ref = storageRef(storage, `${user.uid}/${imageFile.name}`);
                await uploadFile(ref, imageFile);
                url = await getDownloadURL(ref)                
            }

            //we update the user info document in the users collection
            const docRef = doc(firestore, `${user.uid}/userInfo`);                  
            await updateDoc(docRef, {
                ...(username && {username: username}),
                ...(aboutMe && {aboutMe: aboutMe}),
                ...(url && {imageURL: url}),
            })                
            
            setOpen(false);            
            setLoading(false);
            forceRender((prevState) => {
                return !prevState;
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