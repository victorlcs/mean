import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
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
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  totalPosts = 0;
  postsPerPage = 2;
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

    this.getPostsFromApi();

    this.store.select('auth').subscribe((data) => {
      this.userId = data.user.userId;
    });

    this.postsSub = this.store
      .pipe(map((state) => fromApp.selectPosts(state)))
      .subscribe({
        next: (postData) => {
          this.isLoading = false;
          this.posts = postData.post;
          this.totalPosts = postData.postCount;
        },
        error: (err) => {
          console.log(err);
        },
      });

    this.store.select('auth').subscribe((data) => {
      console.log(data);
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
    //this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService
      .deletePost(postId)
      .subscribe({
        next: () =>
          this.postsService.getPosts(this.postsPerPage, this.currentPage),
        error: () => (this.isLoading = false),
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    //this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.getPostsFromApi();
  }

  test() {
    console.log(this.postsSub.closed);
  }
}
