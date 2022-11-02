import React from 'react';
import {auth} from './Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import NavigationBar from './NavigationBar';
import HomePage from './HomePage';
import LogInPage from './LogInPage';
import CreateAccount from './CreateAccount';
import AccountPage from './AccountPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
    //const [user] = useAuthState(auth);

    return(
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/login" element={<LogInPage/>}/>
                <Route path="/create-account" element={<CreateAccount/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;