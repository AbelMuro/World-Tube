import React, {useState, memo} from 'react';
import {TextField, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
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

function DialogSearchBox({setOpen}) {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const submitSearch = () => {
        if(Cookies.get("useCookies") == "true" && search) {
            const allSearchQueries = Cookies.get("allSearchQueries");
            if(allSearchQueries) {
                allSearchQueries += (" " + search);
                Cookies.set("allSearchQueries", allSearchQueries);
            }
            else
                Cookies.set("allSearchQueries", search);
        }
        navigate('/', {state: {search: search.toLowerCase()}});
        setOpen(false);
    }

    return(
            <>
                <TextField variant="outlined" value={search} onChange={handleSearch} label="Enter Search"/>
                <StyledButton variant="contained" onClick={submitSearch}>Submit</StyledButton>
            </>
    )
}

export default memo(DialogSearchBox);