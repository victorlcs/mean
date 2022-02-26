import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //const authToken = this.authService.getToken();
    let authToken;
    this.store.select('auth').subscribe(data => {
       authToken = data.user.token;
    })
    
    const authRequest = request.clone({
      headers: request.headers.set('Authorization',`Bearer ${authToken}`)
    });
    return next.handle(authRequest);
  }
}
