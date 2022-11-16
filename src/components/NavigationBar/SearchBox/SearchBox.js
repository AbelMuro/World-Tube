import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'; 
import styles from './styles.module.css';
import {useNavigate} from 'react-router-dom';


function SearchBox(){
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
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
        if(search != "") //TODO: lower case search
            navigate("/", {state: {search: search}})
    },[search])

    return(                   
        <div className={styles.searchBoxContainer} onFocus={expandSearchBox} onBlur={shrinkSearchBox}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon}/>
            <input id="search" type="text" className={styles.searchBox} value={search} onChange={handleSearch}/>
        </div>
    )
}

export default SearchBox;