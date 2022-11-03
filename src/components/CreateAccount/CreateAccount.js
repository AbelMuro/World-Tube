import React, {useState} from 'react';
import styles from './styles.module.css';
import {auth, firestore} from '../Firebase-config';
import {updateProfile, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {collection, addDoc} from 'firebase/firestore';
import AccountPage from '../AccountPage';
import {useUploadFile} from 'react-firebase-hooks/storage';
import {TextField, Stack, Button} from '@mui/material';
import {styled} from '@mui/system';

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

function CreateAccount() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user] = useAuthState(auth);
    //const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    let disable = !password.match(/\d/g) || !password.match(/\W/g) || !password.match(/[a-zA-Z]/g) || password.length < 6;

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    
    const handleRegister = async () => {
        try{
            if(username == "") throw {message: "username is empty"};
            await createUserWithEmailAndPassword(auth, email, password);
            updateProfile(auth.currentUser, {displayName: username});
            const collectionRef = collection(firestore, auth.currentUser.uid);
            await addDoc(collectionRef, {skip: "skip"});
        }
        catch(error){
            if(error.message == "Firebase: Error (auth/email-already-in-use).")
                alert("Email is already registered");
            else
                console.log(error.message);
        }
    }

    return user ? (<AccountPage/>) : (
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
                    <TextField id="outlined-basic" label="Enter Password" value={password} onChange={handlePassword} sx={{backgroundColor: "white"}}/>       
                    <StyledButton disabled={disable} variant="contained" onClick={handleRegister}>
                        Register   
                    </StyledButton>             
                </Stack>

            </div>            
        </section>) 
}

export default CreateAccount;