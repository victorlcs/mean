import { Action } from '@ngrx/store';
import { Post } from '../post.model';
import * as postAction from './post.action';

export interface State {
    post: Post[],
    postCount: number
}

export interface AppState {
    post: State
}

const initialState:State = {
   post:new Array<Post>(),
   postCount: 0
};

export function postReducer(state = initialState,action:postAction.PostAction) {
    switch(action.type){
        case postAction.SET_POST: {
            return {
                ...state,
                post : action.payload
            }
        }
        case postAction.SET_POST_COUNT: {
            return {
                ...state,
                postCount: action.payload
            }
        }
        default : {
            return state;
        }
    }
}