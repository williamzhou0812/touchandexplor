import { ACTIVITY_DESTINATION_LIST } from '../actions/types';

export default function(state = {}, action) {
    switch (action.type) {
        case ACTIVITY_DESTINATION_LIST:
            return action.payload;
        default:
            return state;
    }
}