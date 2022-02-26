import { createAction, props } from "@ngrx/store";
import { User } from "../auth-data.model";

enum AuthActionsNames {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

export const Login = createAction(AuthActionsNames.LOGIN,props<{data:User}>());
export const Logout = createAction(AuthActionsNames.LOGOUT);