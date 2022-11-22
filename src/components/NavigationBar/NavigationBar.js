import React from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {auth} from '../Firebase-config';
import {signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Button} from '@mui/material';
import {styled} from '@mui/system';
import SearchBox from './SearchBox';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useMediaQuery} from 'react-responsive';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
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
    const mobile = useMediaQuery({query : "(max-width: 470px)"})

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

    const handleNav = () => {
        const navBar = document.querySelector("." + styles.navBarTwo);
        const currentHeight = navBar.style.height;
        navBar.style.height = currentHeight == "287px" ? "40px" : "287px"  
    }


    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/login");
    }

    return (
        <nav className={styles.navigationBar}>
            <section className={styles.navBarOne}>
                <h1 className={styles.logo} onClick={handleHomePage}>
                    WORLD VIEW
                </h1>

                <div className={styles.accountItems}>        
                    <SearchBox/>
                    {user ? <a className={styles.accountLink} onClick={user.emailVerified ? handleAccount : handleLogin} title="Account"><AccountCircleIcon fontSize="large"/></a> : 
                     <a className={styles.accountLink} onClick={handleLogin} title="Account"><AccountCircleIcon fontSize="large"/></a>}

                    {user ? 
                    <StyledButton onClick={user.emailVerified ? handleSignOut : handleCreateAccount}>Sign Out</StyledButton> : 
                    <StyledButton className={styles.signUpButton} onClick={handleCreateAccount}>Sign Up</StyledButton>}
                </div>
            </section>
            <section className={styles.navBarTwoBackground}>
                <div className={styles.navBarTwo}>

                    {mobile ? <StyledMenuIcon fontSize={"large"} onClick={handleNav}/> : <></>}

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
