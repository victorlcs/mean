import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login', //not necessary this component is going to be called with router only
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(public authService:AuthService) { }

  ngOnInit(): void {
  }

  onLogin(form:NgForm){
    if (form.invalid){
      return
    }
    this.authService.login(form.value.email,form.value.password);
  }
}
