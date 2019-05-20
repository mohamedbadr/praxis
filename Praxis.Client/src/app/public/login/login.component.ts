import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BaseComponent } from '../../utilities/base.component';
import { InjectHelper } from './../../utilities/helpers/inject.helper';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public injectHelper: InjectHelper,
    private fb: FormBuilder
  ) {
    super(injectHelper);
  }

  ngOnInit() {
    this.document.body.classList.add('login');
    this.createFrom();
  }

  private createFrom() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit() {
    this.busy = this.authService.login(
      this.form.controls['username'].value,
      this.form.controls['password'].value
    ).subscribe(result => {

      this.onLoginSuccess();
    }, error => {
      this.showErrorMessage('Invalid user name or password');
    });
  }

  private onLoginSuccess() {
    const userRoles = this.authService.getUserRoles();
    if (userRoles.indexOf('Company') > -1) {
      this.router.navigate(['/']);
    } else {

      console.log('it is a customer');
      this.router.navigate(['/customer-products']);
    }
  }

}
