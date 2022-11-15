import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import { TextField, Box, Stack} from '@mui/material';
import styles from './styles.module.css';


const TextFields = forwardRef((props, ref) => {
    const [username, setUsername] = useState("");
    const [aboutme, setAboutme] = useState("");
    const newUsername = useRef();
    const aboutMe = useRef();

    useImperativeHandle(ref, () => ({
        get username() {
            return newUsername.current;
        },
        get aboutMe() {
            return aboutMe.current;
        },
        get state() {
            return username;
        }
    }))

    const handleUsername = (e) => {
        if(e.target.value.length <= 15)
            setUsername(e.target.value)
    }
    const handleAboutme = (e) => {
        if(e.target.value.length <= 150)
            setAboutme(e.target.value)
    }

    return(
        <Stack>        
            <Box className={styles.desc}>
                Username must be within 15 characters
            </Box>                
            <TextField variant="outlined" label="Enter new username" value={username} onChange={handleUsername} inputRef={newUsername}/>
            <Box className={styles.desc}>
                'About me' must be within 150 characters
            </Box>
            <TextField variant="outlined" label="About me.." rows={6} multiline value={aboutme} onChange={handleAboutme} inputRef={aboutMe}/>
        </Stack>
    )
})

export default TextFields;