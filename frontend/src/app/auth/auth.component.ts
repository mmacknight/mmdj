import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import { User } from '@classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public loginForm: FormGroup;
  public loginClicked: Boolean;
  public registerForm: FormGroup;
  public registerClicked: Boolean;
  public user: User;
  public invalid: Boolean;
  public nextPage: string; 

  constructor(fb: FormBuilder, public apiService: ApiService, public userService: UserService, public router: Router) {
    this.loginClicked = true;
    this.registerClicked = false;
    this.nextPage = window.innerWidth > 600 ? 'host': 'join';

    this.loginForm = fb.group({
      username: '',
      password: ''
    });

    this.registerForm = fb.group({
      username: '',
      password: ''
    });
  }

  ngOnInit() {
    
  }

  onLoginClick() {
    console.log("login");
    this.registerClicked = false;
    this.loginClicked = !this.loginClicked;
  }

  onRegisterClick() {
    this.loginClicked = false;
    this.registerClicked = !this.registerClicked;
  }

  login() {
    this.apiService.get_user(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(
      user  => {
        console.log("Login, ", user)
        this.router.navigate([this.nextPage]);
        this.userService.login(user)
        this.invalid = false
      },
      error => {
        this.invalid = true,
        console.log(error)
      }
    )
  }

  register() {
    this.user = new User();
    this.user.user_id = 0;
    this.user.username = this.registerForm.controls.username.value;
    this.user.password = this.registerForm.controls.password.value;
    this.apiService.post_User(this.user).subscribe(
      user  => {
        console.log("User created, ", user),
        this.userService.login(user);
        this.router.navigate([this.nextPage]);
        this.invalid = false
      },
      error => {
        if ( error.status > 400) {
          this.invalid = true,
          console.log(error)
        }
      }
    )
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth > 600) {
      this.nextPage = 'host';
    }
    else {
      this.nextPage = 'join';
    }
  }

}
