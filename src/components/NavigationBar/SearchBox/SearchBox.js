import React, {useState} from 'react';
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
       const submitButton = document.querySelector("." + styles.submit);
       searchBox.style.width = "300px";
       submitButton.style.display = "block";
    }

    const shrinkSearchBox = () => {
        const searchBox = document.querySelector("." + styles.searchBox);
        const submitButton = document.querySelector("." + styles.submit);
        searchBox.style.width = "100px";
        submitButton.style.display = "none";
    }

    const sendSearchQuery = () => {
        navigate("/", {state: {search: search}});
    }

    return(                   
        <div className={styles.searchBoxContainer} onFocus={expandSearchBox} >
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon}/>
            <input id="search" type="text" className={styles.searchBox} value={search} onChange={handleSearch}/>
            <button className={styles.submit} onClick={sendSearchQuery}>
                Search
            </button>
        </div>
    )
}

export default SearchBox;