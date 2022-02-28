import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Post } from './post.model';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as postActions from './store/post.action';
import * as fromApp from '../store/app.reducer';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  //private posts: Post[] = [];
  //private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private PostStore: Store<fromApp.AppState>
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
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
        })
      )
      .subscribe((transformedPosts) => {
        //this.posts = transformedPosts.posts;
        //this.postsUpdated.next({posts:[...this.posts],postCount:transformedPosts.maxPosts});
        //this.PostStore.dispatch(new AddPost(transformedPosts.posts));
        //this.PostStore.dispatch(new SetPostCount(transformedPosts.maxPosts));
      });
  }

  getPostsTest(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http.get<{ message: string; posts: any; maxPosts: number }>(
      BACKEND_URL + queryParams
    );
  }

  // getPostUpdateListener() {
  //   return this.postsUpdated.asObservable();
  // }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    //const post: Post = { id: '', title: title, content: content };
    const postData = new FormData(); //able to combine text value with blob (files)
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    //const post: Post = { id: id, title: title, content: content, imagePath:null };
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe((res) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string, imagePath: string) {
    return this.http.delete(BACKEND_URL + postId + `?imagepath=${imagePath}`);
  }
}
