import {configureStore} from '@reduxjs/toolkit';
import Reducer from './Reducers';

const store = configureStore({
    reducer: Reducer
})

export default store;