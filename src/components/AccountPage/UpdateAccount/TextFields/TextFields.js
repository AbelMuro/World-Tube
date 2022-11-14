import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import { TextField } from '@mui/material';


const TextFields = forwardRef((props, ref) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [aboutme, setAboutme] = useState("");
    const newUsername = useRef();
    const newEmail = useRef();
    const aboutMe = useRef();

    useImperativeHandle(ref, () => ({
        get username() {
            return newUsername.current;
        },
        get email() {
            return newEmail.current;
        },
        get aboutMe() {
            return aboutMe.current;
        }
    }))

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleAboutme = (e) => {
        setAboutme(e.target.value)
    }



    return(
        <>                        
            <TextField variant="outlined" label="Enter new username" value={username} onChange={handleUsername} inputProps={{}} inputRef={newUsername}/>
            <TextField variant="outlined" label="Enter new email" value={email} onChange={handleEmail} type="email" inputRef={newEmail}/>
            <TextField variant="outlined" label="About me.." rows={6} multiline value={aboutme} onChange={handleAboutme} inputRef={aboutMe}/>
        </>
    )
})

export default TextFields;