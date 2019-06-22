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

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public errorHandler: ErrorHandlerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {}, (err: any) => {
      console.log(err);
      if (err instanceof HttpErrorResponse) {
        this.errorHandler.handleError(err);
      }
    }));
  }
}
