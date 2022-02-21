import { Action } from '@ngrx/store';
import { Post } from '../post.model';

export const SET_POST = "SET_POST";
export const SET_POST_COUNT = "SET_POST_COUNT";
//export const UPDATE_POST = "UPDATE_POST";

export class AddPost implements Action {
    readonly type = SET_POST;
    constructor(public payload: Post) {
    }
}
export class SetPostCount implements Action {
    readonly type = SET_POST_COUNT;
    constructor(public payload: number) {
    }
}

export type PostAction = AddPost | SetPostCount;
// export class UpdatePost implements Action {
//     readonly type = UPDATE_POST;
//     constructor(public payload: Post) {
//     }
// }