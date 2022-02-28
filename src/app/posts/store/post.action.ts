import { Action, createAction, props } from '@ngrx/store';
import { Post } from '../post.model';

enum postActionNames {
  SET_POST = 'SET_POST',
  SET_POST_COUNT = 'SET_POST_COUNT',
  SET_PAGE_COUNT = 'SET_PAGE_COUNT',
  GET_POSTS = 'GET_POSTS',
  GET_POSTS_ERROR = 'GET_POSTS_ERROR',
}
//export const UPDATE_POST = "UPDATE_POST";

// export class AddPost implements Action {
//     readonly type = SET_POST;
//     constructor(public payload: Post[]) {
//     }
// }
// export class SetPostCount implements Action {
//     readonly type = SET_POST_COUNT;
//     constructor(public payload: number) {
//     }
// }

// export type PostAction = AddPost | SetPostCount;

export const addPost = createAction(
  postActionNames.SET_POST,
  props<{ data: Post[]; count: number }>()
);
//export const setPostCount = createAction(SET_POST_COUNT);

//export const setPostCount = createAction(postActionNames.SET_POST_COUNT,props<{count:number}>());
export const setPageCount = createAction(
  postActionNames.SET_PAGE_COUNT,
  props<{ pageCount: number }>()
);

export const getPosts = createAction(
  postActionNames.GET_POSTS,
  props<{ postsPerPage: number; currentPage: number }>()
);
export const getPostsError = createAction(
  postActionNames.GET_POSTS_ERROR,
  props<{ errorMsg: string }>()
);
