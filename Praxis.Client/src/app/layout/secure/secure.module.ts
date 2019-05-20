import { NgModule } from '@angular/core';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [
  ]
})
export class SecureModule { }
