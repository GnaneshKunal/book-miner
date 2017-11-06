import {
    GET_BOOK
} from '../actions/types';

interface IActionProps {
    type: string,
    payload: any
}

export default function(state = {}, action: IActionProps) {
    switch(action.type) {
        case GET_BOOK:
            return { ...state, data: action.payload }; 
    }
    
    return state;
}