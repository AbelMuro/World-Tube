import React, {useState, memo} from 'react';
import CookieIcon from '@mui/icons-material/Cookie';
import Cookies from 'js-cookie';
import {Dialog, DialogTitle, DialogContent, Stack, Button} from '@mui/material';
import {styled} from '@mui/system';

const StyledDialogContent = styled(DialogContent)`
    background-color: #252525;
    color: white;
    font-family: "crimson text";
`

const StyledButton = styled(Button)`
    background-color: #F4F3F3;
    color: #464646;
    font-family: "crimson text";

    &:hover {
        background-color: #464646;
        color: #F4F3F3;
    }     
`

function UseCookies() {
    const useCookies = Cookies.get("useCookies");
    const [open, setOpen] = useState(useCookies ? false : true);

    const handleAccept = () => {
        Cookies.set("useCookies", "true");
        setOpen(false);
    }

    const handleDecline = () => {
        Cookies.set("useCookies", "false")
        setOpen(false);
    }

    return(<>
            <Dialog open={open}>
                <StyledDialogContent>
                    <DialogTitle sx={{textAlign: "center"}}>
                        Cookies <CookieIcon fontSize="large"/>
                    </DialogTitle>
                    <Stack spacing={2} sx={{width: "300px"}}>
                        <p>
                            This site uses cookies to store information about your preferences,
                            we respect your privacy and will use the info we got from your search results
                            for marketing purposes.
                        </p>
                        <StyledButton variant="contained" onClick={handleAccept}>
                            Accept
                        </StyledButton>
                        <StyledButton variant="contained" onClick={handleDecline}>
                            Decline
                        </StyledButton>
                    </Stack>

                </StyledDialogContent>

            </Dialog>
            </>)
}

export default memo(UseCookies);