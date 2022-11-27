import React, {useState} from 'react';
import styles from './styles.module.css';
import {auth, firestore} from '../Firebase-config';
import {updateProfile, createUserWithEmailAndPassword, signOut, sendEmailVerification} from 'firebase/auth';
import {TextField, Stack, Button, CircularProgress, Dialog, DialogTitle, DialogContent, useMediaQuery} from '@mui/material';
import {styled} from '@mui/system';
import { useNavigate } from 'react-router-dom';
import emptyAvatar from './images/empty avatar.png';
import { setDoc , getDoc, doc } from 'firebase/firestore';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover:not(:disabled) {
        background-color: #464646;
        color: #F4F3F3;
    }     
    
    &:disabled {
        background-color: rgb(46, 46, 46);
        color: rgb(100, 100, 100);
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

function CreateAccount() {
    const mobile = useMediaQuery("(max-width: 515px)");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [openEmailVerificationDialog, setOpenEmailVerificationDialog] = useState(false);
    const [openEmailInUseDialog, setOpenEmailInUseDialog] = useState(false);
    const [openUsernameIsEmptyDialog, setOpenUsernameIsEmptyDialog] = useState(false);
    const [openUsernameAlreadyExistsDialog, setOpenUsernameAlreadyExistsDialog] = useState(false);
    const [openEmailIsInvalidDialog, setOpenEmailIsInvalidDialog] = useState(false);
    const navigate = useNavigate();
    let disable = !password.match(/\d/g) || !password.match(/\W/g) || !password.match(/[a-zA-Z]/g) || password.length < 6 || loading;

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const navigateToLoginPage = () => {
        setOpenEmailVerificationDialog(false);
        navigate("/login");
    }

    const closeEmailInUseDialog = () => {
        setOpenEmailInUseDialog(false);
    }
    
    const closeUsernameIsEmptyDialog = () => {
        setOpenUsernameIsEmptyDialog(false)
    }

    const closeUsernameAlreadyExistsDialog = () => {
        setOpenUsernameAlreadyExistsDialog(false);
    }

    const closeEmailIsInvalidDialog = () => {
        setOpenEmailIsInvalidDialog(false);
    }

    async function removeUsername() {
        const devsDocRef = doc(firestore, `developers collection/userInfo`); 
        const devsDoc = await getDoc(devsDocRef); 
        const allUsernames = devsDoc.data().allUsernames;
        const updatedUsernames = allUsernames.filter((user) => {
            const currentUser = user.username;
            if(currentUser == username)
                return false;
            else
                return true;
        })
        await setDoc(devsDocRef, {
            allUsernames: updatedUsernames
        });
    }

    const handleRegister = async () => {
        try{
            if(username == "") throw {message: "username is empty"};       
            setLoading(true);            
            //storing the user's username in the developers collection for later reference and also checking if the user's username already exists in the firestore
            const devsDocRef = doc(firestore, `developers collection/userInfo`); 
            const devsDoc = await getDoc(devsDocRef); 
            if(devsDoc.exists()){
                const allUsernames = devsDoc.data().allUsernames;
                allUsernames.forEach((usernameDoc) => {
                    const currentUsername = usernameDoc.username;  
                    if(currentUsername == username)
                        throw {message: "username already exists"}  
                })
                let docArray = [{username: username}];
                docArray.push(...allUsernames);          
                await setDoc(devsDocRef,{
                    allUsernames: docArray
                });                
            }
            else{
                await setDoc(devsDocRef,{
                    allUsernames: [{username: username}]
                })
            }
            //once we verifed that the username doesn't already exist in the database, we can go ahead and create the users account
            const credentials = await createUserWithEmailAndPassword(auth, email, password); 
            //storing the username in the users personal collection
            const usersDocRef = doc(firestore,`${auth.currentUser.uid}/userInfo`);
            await setDoc(usersDocRef, {username: username, imageURL: emptyAvatar});
            //updating the profile and sending an email verification to the user
            await updateProfile(auth.currentUser, {displayName: username, photoURL: emptyAvatar});
            await sendEmailVerification(credentials.user);                   
            await signOut(auth); 
            setLoading(false);
            setOpenEmailVerificationDialog(true);            
        }
        catch(error){
            setLoading(false);
            if(error.message == "Firebase: Error (auth/email-already-in-use)."){
                removeUsername()
                setOpenEmailInUseDialog(true); 
            }
                
            else if(error.message == "username is empty")
                setOpenUsernameIsEmptyDialog(true)
            
            else if(error.message == "username already exists")
                setOpenUsernameAlreadyExistsDialog(true);

            else{
                removeUsername()
                setOpenEmailIsInvalidDialog(true);
            }
        }
    }


    return(
        <section className={styles.flex}>
            <div className={styles.accountContainer}>
                <h1 className={styles.title}>
                    Create Account
                </h1>
                <p className={styles.desc}>
                    Password must have at least
                    one digit, one letter, 
                    one symbol, and must have 
                    6 or more characters
                </p>
                <Stack spacing={2}>
                    <TextField id="outlined-basic" label="Enter Username" value={username} onChange={handleUsername} sx={{backgroundColor: "white"}}/>
                    <TextField id="outlined-basic" label="Enter Email" value={email} onChange={handleEmail} sx={{backgroundColor: "white"}}/>
                    <TextField id="outlined-basic" label="Enter Password" value={password} onChange={handlePassword} sx={{backgroundColor: "white"}} type="password"/>       
                    <Stack sx={{position: "relative"}}> 
                        <StyledButton disabled={disable} variant="contained" onClick={handleRegister}>
                            Register   
                        </StyledButton> 
                        {loading ? <CircularProgress size={32} className={styles.loadingIcon}/> : <></>}                            
                    </Stack> 
                </Stack>
                <Dialog open={openEmailVerificationDialog}>
                    <DialogContent className={styles.dialogContent} sx={( mobile ? {} : {width: "400px"})}>
                        <DialogTitle className={styles.dialogTitle}>
                            Please verify your email. An email link was sent to the email address you provided
                        </DialogTitle>
                        <DialogButton variant="contained" onClick={navigateToLoginPage} >
                            OK
                        </DialogButton>
                    </DialogContent>
                </Dialog>
                <Dialog open={openEmailInUseDialog}>
                    <DialogContent className={styles.dialogContent}>
                        <DialogTitle className={styles.dialogTitle} style={{textAlign: "center"}}>
                            Email is already registered
                        </DialogTitle>
                        <DialogButton variant="contained" onClick={closeEmailInUseDialog} >
                            OK
                        </DialogButton>
                    </DialogContent>
                </Dialog>
                <Dialog open={openUsernameIsEmptyDialog}>
                    <DialogContent className={styles.dialogContent}>
                        <DialogTitle className={styles.dialogTitle} style={{textAlign: "center"}}>
                            Username is empty
                        </DialogTitle>
                        <DialogButton variant="contained" onClick={closeUsernameIsEmptyDialog}>
                            OK
                        </DialogButton>
                    </DialogContent>
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
                <Dialog open={openEmailIsInvalidDialog}>
                    <DialogContent className={styles.dialogContent}>
                        <DialogTitle className={styles.dialogTitle} style={{textAlign: "center"}}>
                            Email is invalid
                        </DialogTitle>
                        <DialogButton variant="contained" onClick={closeEmailIsInvalidDialog}>
                            OK
                        </DialogButton>
                    </DialogContent>
                </Dialog>
            </div>            
        </section>) 
}

export default CreateAccount;