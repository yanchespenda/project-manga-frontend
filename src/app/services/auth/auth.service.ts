import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../models';

import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isValidUser: boolean;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    const temp_local = cookieService.get('currentUser');
    let temp_data;
    let isLocalPass = false;

    console.group( 'JWT Report:' );

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
      this.currentUserSubject = new BehaviorSubject<User>({'id': 0, 'username': '', 'token': ''});
    }
    this.currentUser = this.currentUserSubject.asObservable();


    console.log( 'temp_local:', temp_local );
    console.log( 'isLocalPass:', isLocalPass );
    console.log( 'temp_data:', temp_data );
    console.log( 'this.isValidUser:', this.isValidUser );
    console.log( 'this.currentUserSubject:', this.currentUserSubject );
    console.log('わかりますデスクトップ');
    console.groupEnd();
  }

  public get currentUserValue(): User {
    if (!this.isValidUser) {
      return null;
    } else {
      return this.currentUserSubject.value;
    }
  }

  /* // Username
  login_1(username: string, csrfData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const data = new HttpParams()
      .set('username', username)
      .set('csrf_name', csrfData['name'])
      .set('csrf_value', csrfData['value']);
    return this.http.post<any>(`${environment.base_api_url}v1/account/login/1`, data, httpOptions)
      .pipe(map(result => {
          return result;
      }));
  } */

  /* // Password
  login_2(password: string, skl: string, csrfData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    const data = new HttpParams()
      .set('password', password)
      .set('skl', skl)
      .set('csrf_name', csrfData['name'])
      .set('csrf_value', csrfData['value']);
    return this.http.post<any>(`${environment.base_api_url}v1/account/login/2`, data, httpOptions)
      .pipe(map(result => {
          if (result.data.status && result.data.result.code === 1 && result.data.result.data !== undefined) {
              localStorage.setItem('currentUser', JSON.stringify(result.data.result.data));
              this.currentUserSubject.next(result.data.result.data);
              this.isValidUser = true;
          }
          return result;
      }));
  } */

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
