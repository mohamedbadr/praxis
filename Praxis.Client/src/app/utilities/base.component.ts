import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { StorageService } from '../core/services/storage.service';
import { InjectHelper } from './helpers/inject.helper';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  template: ''
})
export class BaseComponent implements OnInit {

  public onDestroy$ = new Subject<void>();
  public busy: Subscription;
  public authService: AuthService;
  public router: Router;
  public storageService: StorageService;
  public lang = environment.defaultLanguage;
  public datePipe = new DatePipe('en-US');

  public singlePicker = {
    singleDatePicker: true,
    showDropdowns: true,
    opens: 'left',
    locale: { format: 'YYYY/MM/DD' }
  };

  public rangePicker = {
    singleDatePicker: false,
    showDropdowns: true,
    autoApply: true,
    opens: 'left',
    autoUpdateInput: true,
    linkedCalendars: false,
    locale: { format: 'YYYY/MM/DD' },
    showCustomRangeLabel: false
  };

  constructor(public injectHelper: InjectHelper) {
    this.authService = this.injectHelper.authService;
    this.router = this.injectHelper.router;
    this.storageService = this.injectHelper.storageService;
  }

  ngOnInit() {
  }


  showErrorMessage(message: string) {
    this.injectHelper.swal.swal('', message, 'error');
  }

  showWarningMessage(message: string) {
    this.injectHelper.swal.swal('', message, 'warning');
  }

  handleError(error: any) {
    console.log('error logged');
    console.log(error);
    if (error.status === 0 || error.status === 404) {
      this.showErrorMessage('Application can not connect to the server');
      return;
    }

    if (error.status === 403) {
      this.showErrorMessage('You do not have enough permissions to perform this operation');
      return;
    }

    if (error.status === 400) {
      this.showErrorMessage(error.error.message);
      return;
    }

    if (error.status === 500) {
      this.showErrorMessage('Unexpected server error');
      return;
    }

    if (error.status === 401) {
      this.showErrorMessage('You do not have enough permissions to perform this operation');
      return;
    }

    this.showErrorMessage(error.message);
  }

  showSuccessNotification(message) {
    this.injectHelper.notificationService.success(
      '',
      message,
    );
  }

  downloadFile(data: Response, mime: string, fileName: string) {
    // const blob = new Blob([data], { type: mime });
    // const url = window.URL.createObjectURL(blob);
    // saveAs(blob, fileName);
    saveAs(data, fileName);
  }

  unsubscribe() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
