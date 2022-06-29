import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit(): void {
  }

  get email() {
    return this.signInForm.get('email')
  }

  get password() {
    return this.signInForm.get('password')
  }

  signIn() {
    console.log('enviou')
  }

}
