import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, ConnectableObservable, BehaviorSubject, Observable } from 'rxjs';
import { map, publishLast, publishReplay } from 'rxjs/operators';

import { ResponseModel } from '../../../app-universal-response-model';
import { HeadMenu } from './app-header-menu-model';

@Injectable({
  providedIn: 'root'
})
export class AppHeaderMenuService {
  headMenuUrl = environment.base_api_url + environment.base_api_version + '/menu/head.json';

  constructor( private http: HttpClient ) {

  }

  /**
   * requestHeadMenu
   */
  requestHeadMenu() {
    const httpOptions = {
      withCredentials: environment.REQUEST_CREDENTIALS
    };

    return this.http.get<HeadMenu>(this.headMenuUrl, httpOptions);
  }
}
