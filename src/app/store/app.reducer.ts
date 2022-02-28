import { ActionReducerMap, createSelector } from '@ngrx/store';
import * as fromPost from '../posts/store/post.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
  post: fromPost.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  post: fromPost.postReducer,
  auth: fromAuth.authReducer,
};

const selectPost = (state: AppState) => state.post;
export const selectPosts = createSelector(selectPost, (post) => {
  return post;
});

export const selectPageSize = createSelector(selectPost, (post) => {
  return post.pageSize;
});
