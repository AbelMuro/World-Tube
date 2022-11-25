import React, {useEffect, useState, memo, forwardRef} from 'react';
import {Button, Stack, Box} from '@mui/material';
import {styled} from '@mui/system';
import styles from './styles.module.css';
import {useMediaQuery} from '@mui/material';

const ReverseStyledButton = styled(Button)`
    background-color: #464646;
    color: #F4F3F3;
    font-family: "crimson text";

    &:hover {
        background-color:#F4F3F3;
        color: #464646;
    }     
`

const UploadImage = forwardRef((props, ref) => {
    const mobile = useMediaQuery("(max-width: 400px)")
    const [image, setImage] = useState([]);

    const handleImage = (e) => {
        setImage(e.target.files);
    }

    useEffect(() => {
        if(image.length == 1){
            const imageContainer = document.querySelector("." + styles.imageUploaded);
            const imageUploaded = imageContainer.firstElementChild;
            imageUploaded.setAttribute("class", styles.image);
            imageUploaded.setAttribute("src", URL.createObjectURL(image[0]));
        }
    }, [image])

    return(   
        <Stack spacing={2} sx={{marginBottom: "10px", ...(mobile ? {width: "250px"} : {})}}>
            <Box sx={{fontSize: "18px", fontFamily: "crimson text"}}>
                Please select images that have the same aspect ratio. {"(1:1)"}
            </Box>
            <ReverseStyledButton variant="contained" component="label" sx={(mobile ? {width: "250px"} : {})}>
                Upload account image
                <input type="file" hidden accept="image/*" onChange={handleImage} ref={ref} />
            </ReverseStyledButton>
            <Box className={styles.imageUploaded}>
                <img />
            </Box>
        </Stack>                 
        )
})



export default memo(UploadImage);