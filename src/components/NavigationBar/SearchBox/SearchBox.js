import React, {useState, useEffect} from 'react';
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from 'react-responsive';
import {Dialog, DialogContent, DialogTitle, Button, Stack} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {styled} from '@mui/system';
import DialogSearchBox from './DialogSearchBox';
import Cookies from 'js-cookie';

const StyledMagnifyingGlass = styled(SearchIcon)`
    position: absolute;
    left: 5px;
    top: 10px;
`
const MobileSearch = styled(SearchIcon)`
    &:hover{
        color: grey;
    }
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

function SearchBox(){
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const mobile = useMediaQuery({query : "(max-width: 680px )"}) 
    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleSearchDialog = () => {
        setOpen((prevState) => {
            return !prevState;
        });
    }

    const expandSearchBox = () => {
       const searchBox = document.querySelector("." + styles.searchBox);
       searchBox.style.width = "300px";
    }

    const shrinkSearchBox = () => {
        const searchBox = document.querySelector("." + styles.searchBox);
        searchBox.style.width = "100px";
        if(Cookies.get("useCookies") == "true" && search) {
            let allSearchQueries = Cookies.get("allSearchQueries");
            if(allSearchQueries) {
                allSearchQueries += "/" + search.replace(" ", "");
                Cookies.set("allSearchQueries", allSearchQueries);
            }
            else
                Cookies.set("allSearchQueries", search);
        }
        setSearch("");
    }

    useEffect(() => {
        if(search != "")
            navigate("/", {state: {search: search.toLowerCase()}})
    },[search])

    return(     
            mobile ? <>
                        <div onClick={handleSearchDialog} className={styles.openSearch}> <MobileSearch fontSize={"large"}/> </div>
                        <Dialog open={open}>
                            <DialogContent className={styles.dialogContent}>
                                <Stack spacing={2}>
                                    <DialogTitle className={styles.dialogTitle}>
                                        Search Videos
                                    </DialogTitle>
                                    <DialogSearchBox setOpen={setOpen}/>
                                    <StyledButton variant="contained" onClick={handleSearchDialog}>Close</StyledButton>
                                </Stack>
                            </DialogContent>
                        </Dialog>   
                    </> :                 
                    <div className={styles.searchBoxContainer} onFocus={expandSearchBox} onBlur={shrinkSearchBox}>
                        <StyledMagnifyingGlass fontSize={"small"}/>
                        <input id="search" type="text" className={styles.searchBox} value={search} onChange={handleSearch}/>
                    </div>
    )
}

export default SearchBox;