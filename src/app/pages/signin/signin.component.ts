import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private cookieService: CookieService
  ) { }

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
      const data = {
        email: this.email?.value,
        password: this.password?.value,
      }
      this.authService.auth(data)
        .subscribe({
          next: (response) => {
            this.cookieService.set('auth.token', response.token, (60 * 60 * 24), '/')
            this.toast.success('Login succeeded', 'Welcome')
            this.router.navigate(['/'])
          },
          error: (response) => {
            this.toast.error(`${response.error.message}`, 'Invalid Login')
          }
        })
    }
  }

}
