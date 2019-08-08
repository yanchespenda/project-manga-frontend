import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../../models';

import { CookieService } from 'ngx-cookie';

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
    const tempLocal = cookieService.get('currentUser');
    let tempData;
    let isLocalPass = false;

    // console.group( 'JWT Report:' );

    if (tempLocal !== undefined && tempLocal !== null && tempLocal !== '') {
      try {
        tempData = JSON.parse(tempLocal);
        isLocalPass = true;
      } catch {
        isLocalPass = false;
      }
    }

    if (tempData !== undefined && isLocalPass) {
      this.isValidUser = true;
      this.currentUserSubject = new BehaviorSubject<User>(tempData);
    } else {
      this.isValidUser = false;
      this.currentUserSubject = new BehaviorSubject<User>({id: 0, username: '', token: ''});
    }
    this.currentUser = this.currentUserSubject.asObservable();


    // console.log( 'tempLocal:', tempLocal );
    // console.log( 'isLocalPass:', isLocalPass );
    // console.log( 'tempData:', tempData );
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
    this.logout();
    this.cookieService.put( 'currentUser', JSON.stringify(setUser), {path: '/', expires: new Date(xp),
      secure: environment.COOKIES_SECURED });
  }

  loginCheckValidation() {
    const getLogin = this.currentUserValue;
    if (getLogin === null) {
      return true;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('e', null);
    this.sendData(this.baseUrlAccount + 'do/vw', data, httpOptions).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.status) {
          return true;
        } else {
          this.cookieService.remove('currentUser', {path: '/'});
          this.currentUserSubject.next(null);
          return false;
        }
      },
      (err) => {
        return false;
      },
      () => {
      }
    );
    return false;
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

  // Do
  do(e: string, t: string, n: string, d: string, rtoken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('e', e)
                  .set('t', t)
                  .set('d', d)
                  .set('n', n)
                  .set('rtoken', rtoken);
    return this.sendData(this.baseUrlAccount + 'do/v0', data, httpOptions);
  }
  // Do
  doA(e: string, t: string, n: string, d: string, rtoken: string, ps1: string, ps2: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('e', e)
                  .set('t', t)
                  .set('d', d)
                  .set('n', n)
                  .set('p1', ps1)
                  .set('p2', ps2)
                  .set('rtoken', rtoken);
    return this.sendData(this.baseUrlAccount + 'do/v1', data, httpOptions);
  }

  sendData(url: string, data: any, option: any) {
    return this.http.post<any>(url, data, option);
  }


  logout() {
    const getLogin = this.currentUserValue;
    if (getLogin === null) {
      return true;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const  data = new HttpParams()
                  .set('e', null);
    this.sendData(this.baseUrlAccount + 'do/vx', data, httpOptions).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        if (jsonData.status) {
          this.cookieService.remove('currentUser', {path: '/'});
          this.currentUserSubject.next(null);
          return true;
        } else {
          return false;
        }
      },
      (err) => {
        return false;
      },
      () => {

      }
    );
    return false;
  }

//   Object.toparams = function ObjecttoParams(obj) {
//     var p = [];
//     for (var key in obj) {
//       p.push(key + '=' + encodeURIComponent(obj[key]));
//     }
//     return p.join('&');
// };
}
