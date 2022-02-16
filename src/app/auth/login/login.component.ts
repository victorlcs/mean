import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login', //not necessary this component is going to be called with router only
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService:AuthService) { }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form:NgForm){
    if (form.invalid){
      return
    }
    this.authService.login(form.value.email,form.value.password);
  }
}
