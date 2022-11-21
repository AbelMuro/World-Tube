import React from 'react';
import {Skeleton, Stack} from '@mui/material';
import {useMediaQuery} from '@mui/material';

function LoadingScreen () {
    const mobile = useMediaQuery("(max-width: 405px)")

    return(
        <>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" width={mobile ? 302.22 : 355} height={mobile ? 170: 200}/>
                <Stack direction="row" spacing={3}>
                    <Skeleton variant="circular" width={50} height={50}/>
                    <Skeleton variant="text" width={250} height={50}/>
                </Stack>
            </Stack>
        </>
    )
}

export default LoadingScreen;