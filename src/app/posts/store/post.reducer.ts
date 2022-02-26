import { createReducer, createSelector, on } from '@ngrx/store';
import { Post } from '../post.model';
import * as postAction from './post.action';

export interface State {
  post: Post[];
  postCount: number;
  errorMsg: string;
}

const initialState: State = {
  post: new Array<Post>(),
  postCount: 0,
  errorMsg : null
};

export const postReducer = createReducer(
  initialState,
  on(postAction.addPost, (state, { data, count }) => ({
    ...state,
    post: data,
    postCount:count,
    errorMsg: null
  })),
  on(postAction.getPostsError, (state, { errorMsg }) => ({
    ...state,
    errorMsg: errorMsg,
  }))
);

