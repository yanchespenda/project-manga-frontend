import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  isLogin = false;
  currentUser: any;

  constructor(
    public errorHandler: ErrorHandlerService,
    public authService: AuthService
  ) {
    this.getIsLogin();
  }

  getIsLogin() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser !== null) {
      this.isLogin = true;
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedReq = request;
    if (this.isLogin) {
      modifiedReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.currentUser.token),
      });
    }
    return next.handle(modifiedReq).pipe(tap((event: HttpEvent<any>) => {}, (err: any) => {
      console.log(err);
      const getErrorCode = err.status || 0;
      if (getErrorCode === 401) {
        console.log('Run 401');
      }
      if (err instanceof HttpErrorResponse) {
        this.errorHandler.handleError(err);
      }
    }));
  }
}
