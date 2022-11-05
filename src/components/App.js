import React from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './HomePage';
import LogInPage from './LogInPage';
import CreateAccount from './CreateAccount';
import DisplayVideo from './DisplayVideo';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {

    return(
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/login" element={<LogInPage/>}/>
                <Route path="/create-account" element={<CreateAccount/>}/>
                <Route path="/:videoname" element={<DisplayVideo />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;