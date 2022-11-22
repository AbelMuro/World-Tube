function Reducer(state = {loadingState : false}, action){

    switch(action.type){
        case 'loading start':
            return {loadingState: true};
        case 'loading stop':
            return {loadingState: false}
        default:
            return state;
    }
}

export default Reducer;