import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http/src/interceptor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StorageService } from '../services/storage.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string;
    const storageDbName = `${environment.appName}:account`;
    const user = this.storageService.getObject(storageDbName);
    if (user != null) {
      token = user.accessToken;
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'accept-language': environment.defaultLanguage
      }
    });

    return next.handle(request);
  }

}
