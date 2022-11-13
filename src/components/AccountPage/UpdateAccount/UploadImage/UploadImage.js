import React, {useEffect, useState, memo, forwardRef} from 'react';
import {Button, Stack, Box} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';

const ReverseStyledButton = styled(Button)`
    background-color: #464646;
    color: #F4F3F3;
    font-family: "crimson text";
    width: 100%;

    &:hover {
        background-color:#F4F3F3;
        color: #464646;
    }     
`

const UploadImage = forwardRef((props, ref) => {
    const [image, setImage] = useState([]);

    const handleImage = (e) => {
        setImage(e.target.files);
    }

    useEffect(() => {
        if(image.length == 1){
            const imageUploaded = document.querySelector("." + styles.imageUploaded);
            imageUploaded.innerHTML = image[0].name;
        }
        
    }, [image])

    return(   
        <Stack spacing={2} sx={{marginBottom: "10px"}}>
            <ReverseStyledButton variant="contained" component="label">
                Upload account image
                <input type="file" hidden accept="image/*" onChange={handleImage} ref={ref}/>
            </ReverseStyledButton>
            <Box className={styles.imageUploaded}>

            </Box>
        </Stack>                 

        )



})



export default memo(UploadImage);