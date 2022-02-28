import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { from, map, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import * as fromApp from '../../store/app.reducer';
import * as postActions from '../store/post.action';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  totalPosts = 0;
  postsPerPage = 0;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    console.log('post-list init');
    this.isLoading = true;

    this.store.select('post').subscribe({
      next: (postData) => {
        if (postData.postCount !== 0 && postData.post.length === 0) {
          this.currentPage = this.currentPage - 1;
          this.getPostsFromApi();
        }
        this.isLoading = false;
        this.posts = postData.post;
        this.totalPosts = postData.postCount;
        this.postsPerPage = postData.pageSize; //Must get initial value before this.getPostsFromApi()
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.getPostsFromApi();

    this.store.select('auth').subscribe((data) => {
      this.userId = data.user.userId;
      this.userIsAuthenticated = data.user.isAuthenticated;
    });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.store.select('auth').subscribe((data) => {
          this.userId = data.user.userId;
        });
      });
  }

  getPostsFromApi() {
    this.store.dispatch(
      postActions.getPosts({
        postsPerPage: this.postsPerPage,
        currentPage: this.currentPage,
      })
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string, imagePath: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId, imagePath).subscribe({
      next: () => {
        this.getPostsFromApi();
      },
      error: () => (this.isLoading = false),
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    //this.postsPerPage = pageData.pageSize;
    this.store.dispatch(
      postActions.setPageCount({ pageCount: pageData.pageSize })
    );
    this.getPostsFromApi();
  }
}
