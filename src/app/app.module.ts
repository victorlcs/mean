import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { PostEffects } from './posts/store/post.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularMaterialModule,
    PostModule,
    AuthModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([PostEffects])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
