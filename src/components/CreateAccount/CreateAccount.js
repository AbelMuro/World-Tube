import React, {useState} from 'react';
import styles from './styles.module.css';
import {TextField, Stack, Button} from '@mui/material';
import {styled} from '@mui/system';

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }         
`

//TODO: make this into a controlled component!
function CreateAccount() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();


    return(
        <section className={styles.flex}>
            <div className={styles.accountContainer}>
                <h1 className={styles.title}>
                    Create Account
                </h1>
                <Stack spacing={2}>
                    <TextField id="outlined-basic" label="Enter Username" sx={{backgroundColor: "white"}}/>
                    <TextField id="outlined-basic" label="Enter Email" sx={{backgroundColor: "white"}}/>
                    <TextField id="outlined-basic" label="Enter Password" sx={{backgroundColor: "white"}}/>       
                    <StyledButton variant="contained">
                        Register   
                    </StyledButton>             
                </Stack>

            </div>            
        </section>

    )
}

export default CreateAccount;