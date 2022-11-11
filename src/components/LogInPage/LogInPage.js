import React, {useState} from 'react';
import styles from './styles.module.css';
import {TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import googleIcon from './images/google icon.png';
import {useSignInWithEmailAndPassword, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {GoogleAuthProvider ,linkWithPopup, linkWithRedirect, EmailAuthProvider, onAuthStateChanged, signOut} from 'firebase/auth';
import {auth} from '../Firebase-config';
import AccountPage from '../AccountPage';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }         
`

function LogInPage () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const logInWithEmailAndPassword = async () => {
        try{
            if(email == "") throw {message: "email is empty"};
            if(password == "") throw {message: "password is empty"};
            let results = await signInWithEmailAndPassword(email, password);
            if(!results) throw {message: "Email or password is incorrect"};
            if(auth.currentUser.emailVerified) 
                navigate("/account-page");
            else{
                alert("Please verify your email")
                signOut(auth);
            }
        }
        catch(error){
            if(error.message == "Email or password is incorrect")
                alert(error.message);
            else if(error.message == "email is empty")
                alert(error.message);
            else if(error.message == "password is empty")
                alert(error.message);
        }
    }

    const logInWithGoogle = async () => {
        try{
            await signInWithGoogle();  
            navigate("/account-page");   
        }
        catch(error){
            console.log(error)
        }
    }



    return (
        <section className={styles.flexContainer}>
            <div className={styles.logInContainer}>
                <h1 className={styles.title}>
                    Log in with your email and password
                </h1>
                <TextField id="outlined" label="Email" type="email" sx={{backgroundColor: "white"}} value={email} onChange={handleEmail} />
                <TextField id="outlined" label="Password" type="password" sx={{backgroundColor: "white"}} value={password} onChange={handlePassword} />
                <StyledButton variant="contained" onClick={logInWithEmailAndPassword} sx={{fontFamily: "crimson text"}}>
                    Log in
                </StyledButton>
                <p className={styles.desc}>
                    ...or you can log in with Google
                </p>
                <button className={styles.logInWithGoogle} onClick={logInWithGoogle}>
                    <img src={googleIcon} className={styles.googleIcon}/>
                    <p className={styles.buttonDesc}>
                        Sign in with Google
                    </p>
                </button>
            </div> 
        </section>
    )  
}

export default LogInPage;