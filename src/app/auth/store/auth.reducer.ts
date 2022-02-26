import { createReducer, on } from "@ngrx/store";
import { User } from "../auth-data.model";
import * as authActions from "./auth.actions";

export interface State {
    user:User
}

const initialState: State = {
    user: {
        userId:null,
        isAuthenticated:false,
        token:null
    }
}

export const authFeatureKey = 'auth';

export const authReducer = createReducer(
    initialState,
    on(authActions.Login, (state,{data}) => (
    {
        ...state,
        user:data
    })),
    on(authActions.Logout, (state) => (
        {
            ...state,
            user:{
                userId:null,
                token:null,
                isAuthenticated:false,
            }
        }))
    );
