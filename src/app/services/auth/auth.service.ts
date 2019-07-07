import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../../models';

import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isValidUser: boolean;

  baseUrl = environment.base_api_url +  environment.base_oauth + '/';
  baseUrlAccount = this.baseUrl + 'account/';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    const temp_local = cookieService.get('currentUser');
    let temp_data;
    let isLocalPass = false;

    // console.group( 'JWT Report:' );

    if (temp_local !== undefined && temp_local !== null && temp_local !== '') {
      try {
        temp_data = JSON.parse(temp_local);
        isLocalPass = true;
      } catch {
        isLocalPass = false;
      }
    }

    if (temp_data !== undefined && isLocalPass) {
      this.isValidUser = true;
      this.currentUserSubject = new BehaviorSubject<User>(temp_data);
    } else {
      this.isValidUser = false;
      this.currentUserSubject = new BehaviorSubject<User>({id: 0, username: '', token: ''});
    }
    this.currentUser = this.currentUserSubject.asObservable();


    // console.log( 'temp_local:', temp_local );
    // console.log( 'isLocalPass:', isLocalPass );
    // console.log( 'temp_data:', temp_data );
    // console.log( 'this.isValidUser:', this.isValidUser );
    // console.log( 'this.currentUserSubject:', this.currentUserSubject );
    // console.log('わかりますデスクトップ');
    // console.groupEnd();
  }

  public get currentUserValue(): User {
    if (!this.isValidUser) {
      return null;
    } else {
      return this.currentUserSubject.value;
    }
  }

  loginSet(id: number, username: string, token: any, xp: any) {
    const setUser = {
      id,
      username,
      token
    };
    this.cookieService.set( 'currentUser', JSON.stringify(setUser), new Date(xp), '/');
  }

  // Login
  login_1(username: string, password: string, rtoken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const data = new HttpParams()
                  .set('username', username)
                  .set('password', password)
                  .set('rtoken', rtoken);
    return this.sendData(this.baseUrlAccount + 'login/v0', data, httpOptions);
  }

  // Login Google Auth || Recovery code
  login_2x3(username: string, password: string, code: string, security: string, rtoken: string, isGA: boolean) {
    let target;
    if (isGA) {
      target = 'v1';
    } else {
      target = 'v2';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const data = new HttpParams()
                  .set('username', username)
                  .set('password', password)
                  .set('code', code)
                  .set('security', security)
                  .set('rtoken', rtoken);
    return this.sendData(this.baseUrlAccount + 'login/' + target, data, httpOptions);
  }

  // Login Request
  login_request(username: string, rtoken: string, isCurrent: number) {
    let target;
    if (isCurrent === 1) {
      target = 'a';
    } else {
      target = 'b';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('email', username)
                  .set('rtoken', rtoken)
                  .set('type', target);
    return this.sendData(this.baseUrlAccount + 'request/v0', data, httpOptions);
  }

  // Login Request Confirm
  login_request_confirm(username: string, code: string, rtoken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('email', username)
                  .set('rtoken', rtoken)
                  .set('code', code);
    return this.sendData(this.baseUrlAccount + 'request/v1', data, httpOptions);
  }

  // Login Request Confirm
  do(username: string, code: string, rtoken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('email', username)
                  .set('rtoken', rtoken)
                  .set('code', code);
    return this.sendData(this.baseUrlAccount + 'request/v1', data, httpOptions);
  }

  sendData(url: string, data: any, option: any) {
    return this.http.post<any>(url, data, option);
  }


  logout() {
    this.cookieService.delete('currentUser');
    this.currentUserSubject.next(null);
  }

//   Object.toparams = function ObjecttoParams(obj) {
//     var p = [];
//     for (var key in obj) {
//       p.push(key + '=' + encodeURIComponent(obj[key]));
//     }
//     return p.join('&');
// };
}
