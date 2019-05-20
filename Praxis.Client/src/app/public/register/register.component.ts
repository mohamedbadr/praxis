import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from '../../utilities/base.component';
import { InjectHelper } from 'src/app/utilities/helpers/inject.helper';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterViewModel } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

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
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      userType: [1],
      fullName: [null, Validators.compose([Validators.required])],
    });
  }

  onUserTypeChange(value) {
    this.form.controls.userType.setValue(value);
  }

  onSubmit() {
    const model = new RegisterViewModel();
    model.email = this.form.controls.email.value;
    model.password = this.form.controls.password.value;
    model.fullName = this.form.controls.fullName.value;
    model.userType = this.form.controls.userType.value;

    this.authService.register(model)
      .subscribe(result => {
        this.router.navigate(['/']);
      }, error => {
        this.handleError(error);
      });
  }

}
