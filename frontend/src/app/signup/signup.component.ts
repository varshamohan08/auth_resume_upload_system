import { Component } from '@angular/core';
import {FormGroup, FormControl, ValidatorFn, AbstractControl} from '@angular/forms';
import {Validators} from '@angular/forms';
import { BackendService } from '../backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: this.passwordMatchValidator('password', 'confirmPassword') });

  LoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  hidePass = true;
  hideConfirmPass = true;
  first_name:any;
  last_name:any;
  email:any;
  password:any;

  constructor(
    private backendService: BackendService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(controlName);
      const confirmPasswordControl = formGroup.get(matchingControlName);
  
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
  
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  signUp() {
    let dctData = {
      'first_name' : this.first_name,
      'last_name' : this.last_name,
      'email' : this.email,
      'password' : this.password,
    }
    this.backendService.postDataBeforeLogin('user/sign_up', dctData).subscribe((res) => {
      if (res['detail'] != 'Success') {
        // this.error_message = res['detail']
        this.toastr.error(res['detail'])
      }
      else {
        localStorage.setItem('username', res['userdetails']['username'])
        localStorage.setItem('access_token', res['access_token'])
        this.router.navigate(['profile']);
      }
    })
  }
  Login() {
    
    let dctData = {
      'email' : this.email,
      'password' : this.password,
    }
    this.backendService.postDataBeforeLogin('user/login', dctData).subscribe((res) => {
      if (res['detail'] != 'Success') {
        // this.error_message = res['detail']
        this.toastr.error(res['detail'])
      }
      else { 
        console.log(res)
        new Promise<void>((resolve, reject) => {
          localStorage.setItem('username', res['userdetails']['username'])
          localStorage.setItem('access_token', res['access_token'])
    
          if (localStorage.getItem('access_token')) {
              resolve();
          } else {
              reject('access_token are not defined');
          }
        })
        .then(() => {
          this.router.navigate(['profile']);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
        
      }
    })
  }

}
