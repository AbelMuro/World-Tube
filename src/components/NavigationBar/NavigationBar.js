import React from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {auth} from '../Firebase-config';
import {signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Button} from '@mui/material';
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


function NavigationBar() {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const handleHomePage = () => {
        navigate("/");
    }

    const handleLogin = () => {
        navigate("/login")
    }

    const handleCreateAccount = () => {
        navigate("/create-account");
    }

    const handleAccount = () => {
        navigate("/account-page");
    }

    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/login");
    }

    return (
        <nav className={styles.navigationBar}>
            <section className={styles.navBarOne}>
                <h1 className={styles.logo} onClick={handleHomePage}>
                    World-Tube
                </h1>
                <div className={styles.accountItems}>
                    <a className={styles.accountLink}>
                        Search
                    </a>
                    {user ? <a className={styles.accountLink} onClick={handleAccount}>Account</a>: 
                    <a className={styles.accountLink} onClick={handleLogin}>
                        Log In
                    </a>}
                    {user ? <StyledButton onClick={handleSignOut}>Sign Out</StyledButton> : 
                    <StyledButton className={styles.signUpButton} onClick={handleCreateAccount}>
                        Sign Up
                    </StyledButton>                    
                    }

                </div>
            </section>
            <section className={styles.navBarTwo}>
                <a className={styles.videoLink}>
                    Music
                </a>
                <a className={styles.videoLink}>
                    Funny
                </a>
                <a className={styles.videoLink}>
                    Sports
                </a>
                <a className={styles.videoLink}>
                    News
                </a>
                <a className={styles.videoLink}>
                    Entertainment
                </a>
            </section>
        </nav>
    )
}

export default NavigationBar;