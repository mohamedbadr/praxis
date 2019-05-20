import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { SweetAlertService } from 'ng2-sweetalert2';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class InjectHelper {
  constructor(
    public swal: SweetAlertService,
    public authService: AuthService,
    public router: Router,
    public notificationService: NotificationsService,
    public storageService: StorageService
  ) {

  }
}
