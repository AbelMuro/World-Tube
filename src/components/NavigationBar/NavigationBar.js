import React, {useState} from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {auth} from '../Firebase-config';
import {signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Button, TextField, Box, createTheme, ThemeProvider} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {styled} from '@mui/system';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     

    &:disabled {
        background-color: rgb(46, 46, 46);
        color: rgb(100, 100, 100);
    }
`

const SearchBox = styled(TextField)`
    background-color: white;
    font-family: "crimson text";
    border-radius: 40px;
    padding: 0px 10px;
`
   


function NavigationBar() {
    const [search, setSearch] = useState("");
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

    const handleCategory = (e) => {
        const category = e.target.innerHTML;
        navigate("/", {state: {category: category}})
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
                    <SearchBox variant="filled" label='Search'/>                        
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
                <a className={styles.videoLink} onClick={handleCategory}>
                    All
                </a>
                <a className={styles.videoLink} onClick={handleCategory}>
                    Music
                </a>
                <a className={styles.videoLink} onClick={handleCategory}>
                    Funny
                </a>
                <a className={styles.videoLink} onClick={handleCategory}>
                    Sports
                </a>
                <a className={styles.videoLink} onClick={handleCategory}>
                    News
                </a>
                <a className={styles.videoLink} onClick={handleCategory}>
                    Other
                </a>
            </section>
        </nav>
    )
}

export default NavigationBar;
