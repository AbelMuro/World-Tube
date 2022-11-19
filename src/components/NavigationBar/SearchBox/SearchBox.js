import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'; 
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from 'react-responsive';
import SearchIcon from '@mui/icons-material/Search';
import {styled} from '@mui/system';

const StyledMagnifyingGlass = styled(SearchIcon)`
    position: absolute;
    left: 5px;
    top: 10px;
`


function SearchBox(){
    const [search, setSearch] = useState("");
    const mobile = useMediaQuery({query : "(max-width: 680px )"}) 
    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleSearchDialog = () => {
        //implement the dialog that will be a controlled component
    }

    const expandSearchBox = () => {
       const searchBox = document.querySelector("." + styles.searchBox);
       searchBox.style.width = "300px";
    }

    const shrinkSearchBox = () => {
        const searchBox = document.querySelector("." + styles.searchBox);
        searchBox.style.width = "100px";
        setSearch("");
    }

    useEffect(() => {
        if(search != "")
            navigate("/", {state: {search: search.toLowerCase()}})
    },[search])

    return(  
        mobile ? <div onClick={handleSearchDialog}> <SearchIcon fontSize={"large"}/> </div> :                 
        <div className={styles.searchBoxContainer} onFocus={expandSearchBox} onBlur={shrinkSearchBox}>
            <StyledMagnifyingGlass fontSize={"small"}/>
            <input id="search" type="text" className={styles.searchBox} value={search} onChange={handleSearch}/>
        </div>
    )
}

export default SearchBox;