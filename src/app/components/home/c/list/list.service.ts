import { environment } from './../../../../../environments/environment';
import { ListModel } from './list.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

environment

@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl = environment.base_api_url + environment.base_api_version + '/home/list.json';


  constructor( private http: HttpClient ) { }

  requestData() {
    const httpOptions = {
      withCredentials: environment.REQUEST_CREDENTIALS
    };

    return this.http.get<any>(this.baseUrl, httpOptions);
  }
}
