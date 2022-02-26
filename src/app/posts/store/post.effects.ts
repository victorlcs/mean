import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { PostsService } from '../posts.service';
import * as postActions from './post.action';

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private postService: PostsService) {}

  getPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.getPosts),
      switchMap((action) => { //swtichMap suitable for http/search calls, because we are not interested in the old request
        console.log(action);
        return this.postService
          .getPostsTest(action.postsPerPage, action.currentPage)
          .pipe(
            map((postData) => {
              let obj = {
                posts: postData.posts.map((post: any) => {
                  return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator,
                  };
                }),
                maxPosts: postData.maxPosts,
              };
              return postActions.addPost({data:obj.posts,count:obj.maxPosts});
            }),
            catchError((error) => of(postActions.getPostsError({errorMsg:error.message})))
          );
      })
    )
  );
}
