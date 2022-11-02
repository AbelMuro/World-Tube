import React, {useState} from 'react';
import styles from './styles.module.css';
import {TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import googleIcon from './images/google icon.png';
import {useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {auth} from '../Firebase-config';
import {signOut} from 'firebase/auth'

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
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle] = useSignInWithGoogle(auth);

    signOut(auth);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }


    const logInWithEmailAndPassword = async () => {
        try{
            if(email == "") throw "email is empty";
            if(password == "") throw "password is empty";
            await signInWithEmailAndPassword(email, password);            
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

    return(
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