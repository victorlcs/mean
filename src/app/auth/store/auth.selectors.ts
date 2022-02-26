import { createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuth = (state:fromAuth.State) => state.user;

export const selectAuthToken = (state:fromAuth.State) => state.user.token;

