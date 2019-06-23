import { environment } from './../../../../../environments/environment';
import { TrendingModel } from './trending.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TrendingService {
  baseUrl = environment.base_api_url + environment.base_api_version + '/home/trending/chapter/';
  sortUrl;

  constructor( private http: HttpClient ) {

  }

  requestDataBySort(sort: string) {
    if (sort === '1') {
      this.sortUrl = '1.json';
    } else if (sort === '2') {
      this.sortUrl = '2.json';
    } else if (sort === '3') {
      this.sortUrl = '3.json';
    } else {
      this.sortUrl = '1.json';
    }
    const urlFix = this.baseUrl + this.sortUrl;
    console.log(this.sortUrl);
    console.log(urlFix);
    return this.requestData(urlFix);
  }

  requestData(theLink: string) {
    const httpOptions = {
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.get<TrendingModel>(theLink, httpOptions);
  }
}
