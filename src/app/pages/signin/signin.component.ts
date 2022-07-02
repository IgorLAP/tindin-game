import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

import { AuthService } from 'src/app/services/auth.service';
import { returnAuthRoutesError } from 'src/app/helpers/returnAuthRoutesError';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required])
  })
  isLogged!: boolean


  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {
    this.isLogged = this.authService.isLogged
    if (this.isLogged) {
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {
  }

  get email() {
    return this.signInForm.get('email')
  }

  get password() {
    return this.signInForm.get('password')
  }

  signIn() {
    if (this.signInForm.valid) {
      this.spinner.show()
      const data = {
        email: this.email?.value,
        password: this.password?.value,
      }
      this.authService.auth(data)
        .subscribe({
          next: (response) => {
            this.spinner.hide()
            this.cookieService.set('auth.token', response.token, (60 * 60 * 24), '/')
            this.toast.success('Login succeeded', 'Welcome')
            this.router.navigate(['/'])
          },
          error: (err) => {
            const { message, name } = returnAuthRoutesError(err)
            this.toast.error(message, name)
            this.spinner.hide()
          }
        })
    }
  }

}
