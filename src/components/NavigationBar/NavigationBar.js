import React from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';

function NavigationBar() {
    const navigate = useNavigate();

    const handleHomePage = () => {
        navigate("/");
    }

    const handleLogin = () => {
        navigate("/login")
    }

    const handleCreateAccount = () => {
        navigate("/create-account");
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
                    <a className={styles.accountLink}>
                        Your Videos
                    </a>
                    <a className={styles.accountLink} onClick={handleLogin}>
                        Log In
                    </a>
                    <button className={styles.signUpButton} onClick={handleCreateAccount}>
                        Sign Up
                    </button>
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