import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router,
    private store:Store<fromApp.AppState>) {
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //const isAuth = this.authService.getIsAuth();
    let isAuth;
    this.store.select('auth').pipe(
      map(state => state.user.isAuthenticated)
    ).subscribe(
      flag => {
        isAuth = flag;
      }
    );
    if (!isAuth) {
      this.router.navigate(['auth/login']);
    }
    return isAuth;
  }
  
}
