import { AuthService } from './../../../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  baseUrl = environment.base_api_url +  environment.base_api_version + '/manga/manga-';
  currentUser: any;
  isLogged = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.currentUser = authService.currentUserValue;
    if (this.currentUser !== null) {
      this.isLogged = true;
    }
  }

  initChapter(mid: string, cid: string) {
    const preLink = mid + '/chapter-' + cid + '.json';
    const urlFix = this.baseUrl + preLink;
    return this.dataGet(urlFix, null);
  }

  dataGet(theLink: string, header: any) {
    const httpOptions = {
      headers: header,
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    if (this.isLogged) {
      httpOptions.headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.currentUser.token
      });
    }
    return this.http.get<any>(theLink, httpOptions);
  }

  dataPost(theLink: string, header: any, param: any) {
    const httpOptions = {
      headers: header,
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.post<any>(theLink, param, httpOptions);
  }
}
