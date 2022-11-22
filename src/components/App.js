import React from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './HomePage';
import LogInPage from './LogInPage';
import CreateAccount from './CreateAccount';
import DisplayVideo from './DisplayVideo';
import AccountPage from './AccountPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './Store';

function App() {

    return(
        <Provider store={store}>
            <BrowserRouter>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/login" element={<LogInPage/>}/>
                    <Route path="/create-account" element={<CreateAccount/>}/>
                    <Route path="/account-page" element={<AccountPage/>}/>
                    <Route path="/:videoname" element={<DisplayVideo />}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App;