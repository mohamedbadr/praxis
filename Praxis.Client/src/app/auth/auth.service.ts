import { Injectable } from '@angular/core';
import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClientService } from '../core/services/http-client.service';
import { StorageService } from '../core/services/storage.service';
import { CryptoHelper } from '../utilities/helpers/crypto.helper';
import { JwtHelper } from '../utilities/helpers/jwt.helper';
import { environment } from './../../environments/environment';



@Injectable()
export class AuthService {

  public storageDbName: string;
  private user: AccountModel = null;

  constructor(
    private httpService: HttpClientService,
    private jwtHelper: JwtHelper,
    private storageService: StorageService,
    private cryptoHelper: CryptoHelper
  ) {
    this.storageDbName = `${environment.appName}:account`;
  }

  isAuthenticated() {
    if (this.user == null) {
      this.user = this.storageService.getObject(this.storageDbName);
    }
    const promise = new Promise((resolve, reject) => {
      resolve(this.user != null);
    });
    return promise;
  }

  login(username: string, password: string): Observable<AccountModel> {
    const data = { username: username, password: password };
    return this.httpService
      .post('account/login', data)
      .pipe(
        map(user => {
          this.user = user;
          this.saveUserToStorage();
          return this.user;
        }),
        catchError((error: Response) => {
          console.log(error);
          const errorType =
            error.status === 400
              ? 'Invalid user name or password'
              : 'Unexpected error';
          return observableThrowError(errorType);
        })
      );
  }

  register(model: RegisterViewModel): Observable<AccountModel> {
    return this.httpService
      .post('account', model)
      .pipe(
        //map(res => res.json()),
        map(user => {
          console.log(user);
          this.user = user;
          this.saveUserToStorage();
          return this.user;
        }),
        catchError((error: Response) => {
          return observableThrowError(error);
        })
      );
  }

  refresh(): Observable<boolean> {
    console.log('refresh');
    const data = { refreshToken: this.user.refreshToken, userId: this.user.id };
    return this.httpService
      .post('account/refresh', data)
      .pipe(
        //map(res => res.json()),
        map(user => {
          this.user = user;
          this.saveUserToStorage();
          return true;
        }),
        catchError((error: Response) => {
          console.log(error);
          this.storageService.delete(this.storageDbName);
          this.user = null;
          return of(false);
        })
      );
  }

  logout() {
    this.storageService.delete(this.storageDbName);
    this.user = null;
  }

  getUserRoles(): Array<string> {
    const token = this.getAccessToken();
    const decodedToken = this.jwtHelper.decodeToken(token);

    if (Array.isArray(decodedToken.roles)) {
      return decodedToken.roles;
    }

    const roles = new Array<string>();
    roles.push(decodedToken.roles);
    return roles;
  }

  public initializeAccountStatus(): boolean {
    this.user = this.storageService.getObject(this.storageDbName);
    return this.user != null;
  }

  public getAccessToken(): string {
    return this.user.accessToken;
  }

  public getEncryptedAccessToken(): string {
    return this.cryptoHelper.encrypt(this.user.accessToken);
  }

  public getUserName(): string {
    return this.user.fullName;
  }

  public getUserId(): string {
    return this.user.id;
  }

  public forgotPassword(email: string): Observable<boolean> {
    return this.httpService.post('account/forgot-password', email, null)
      .pipe(map(res => res.json()));
  }

  public resetPassword(model: ResetPasswordModel): Observable<boolean> {
    return this.httpService.post('account/reset-password', model)
      .pipe(map(res => res.json()));
  }

  public validateUsername(user: any): Observable<boolean> {
    return this.httpService.post('account/validate-username', user, null)
      .pipe(map(res => res.json()));
  }

  private saveUserToStorage() {
    this.storageService.setObject(this.storageDbName, this.user);
  }
}

export class AccountModel {
  id: string;
  username: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
}

export class RegisterViewModel {
  public fullName: string;
  public email: string;
  public password: string;
  public userType: number;
}

export class ChangePasswordModel {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class ResetPasswordModel {
  userId: string;
  token: string;
  password: string;
  confirmPassword: string;
}
