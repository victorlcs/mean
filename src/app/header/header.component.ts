import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(
    private authService:AuthService,
    private router:Router,
    private store:Store<fromApp.AppState>) { }
  

  ngOnInit(): void {
    //this.userIsAuthenticated = this.authService.getIsAuth();
    // this.store.select('auth').subscribe(
    //   data => {
    //     this.userIsAuthenticated  = data.user.isAuthenticated;
    //   }
    // );
    this.store.select(state => state.auth.user.isAuthenticated).subscribe(
      isAuthenticated => {
        this.userIsAuthenticated  = isAuthenticated;
      }
    );

    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated)=>{
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
