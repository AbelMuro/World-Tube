import React from 'react';
import {auth} from './Firebase-config';
import {useAuthState} from 'react-firebase-hooks/auth';
import NavigationBar from './NavigationBar';
import LogInPage from './LogInPage';
import AccountPage from './AccountPage';

//TODO: install react routers here
function App() {
    const [user] = useAuthState(auth);

    return(
        <>
            <NavigationBar />
        </>
    )
}

export default App;