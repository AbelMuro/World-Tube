import React, {useState} from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {auth} from '../Firebase-config';
import {signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Button} from '@mui/material';
import {styled} from '@mui/system';
import SearchBox from './SearchBox';
import MenuIcon from '@mui/icons-material/Menu';

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

const StyledMenuIcon = styled(MenuIcon)`
    cursor: pointer;

    &:hover{
        color: grey;
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

    const handleCategory = (e) => {
        const category = e.target.innerHTML;
        navigate("/", {state: {category: category}})
    }

    const handleNav = (e) => {
        const navBar = e.target.parentElement.parentElement;
        const currentHeight = navBar.style.height;
        navBar.style.height =  currentHeight ?  currentHeight == "auto" ? "40px" : "auto"  
                                            : "auto";
    }


    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/login");
    }

    return (
        <nav className={styles.navigationBar}>
            <section className={styles.navBarOne}>
                <h1 className={styles.logo} onClick={handleHomePage}>
                    WORLD-TUBE
                </h1>

                <div className={styles.accountItems}>        
                    <SearchBox/>
                    {user ? 
                    user.emailVerified ? <a className={styles.accountLink} onClick={handleAccount}>Account</a>: 
                    <a className={styles.accountLink} onClick={handleLogin}>
                        Log In
                    </a> :  <a className={styles.accountLink} onClick={handleLogin}>Log In</a>}

                    {user ? 
                    user.emailVerified ? <StyledButton onClick={handleSignOut}>Sign Out</StyledButton> : 
                    <StyledButton className={styles.signUpButton} onClick={handleCreateAccount}>
                        Sign Up
                    </StyledButton> :  <StyledButton className={styles.signUpButton} onClick={handleCreateAccount}>Sign Up</StyledButton>}
                </div>
            </section>
            <section className={styles.navBarTwoBackground}>
                <div className={styles.navBarTwo}>
                    <div className={styles.hamburger}>
                        <StyledMenuIcon fontSize={"large"} onClick={handleNav}/>
                    </div>
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
                </div>
            </section>

        </nav>
    )
}

export default NavigationBar;
