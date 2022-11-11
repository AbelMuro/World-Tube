import React, {useState} from 'react';
import styles from './styles.module.css';
import {TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import googleIcon from './images/google icon.png';
import {useSignInWithEmailAndPassword, useSignInWithGoogle, useAuthState} from 'react-firebase-hooks/auth';
import {GoogleAuthProvider ,linkWithCredential} from 'firebase/auth';
import {auth} from '../Firebase-config';
import AccountPage from '../AccountPage';

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
    const [user] = useAuthState(auth);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

//TODO: try to link the users account to google and email/password;
    const logInWithEmailAndPassword = async () => {
        try{
            if(email == "") throw "email is empty";
            if(password == "") throw "password is empty";
            const googleProvider = new GoogleAuthProvider();
            let results = await signInWithEmailAndPassword(email, password);     
            await linkWithCredential(auth.currentUser, googleProvider);               
        }
        catch(error){
            console.log(error);
        }
    }

    const logInWithGoogle = async () => {
        try{
           await signInWithGoogle();


        }
        catch(error){
            console.log(error)
        }
    }
        //
    return user ? (<AccountPage/>) : (
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