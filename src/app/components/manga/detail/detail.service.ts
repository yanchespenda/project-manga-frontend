import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  baseUrl = environment.base_api_url +  environment.base_api_version + '/manga/manga-';
  fixUrl: string;

  constructor( private http: HttpClient ) { }

  requestMangaA(id: string) {
    this.fixUrl = id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix, null);
  }

  requestMangaInfo(id: string) {
    this.fixUrl = 'information-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix, null);
  }

  requestMangaStats(id: string) {
    this.fixUrl = 'stats-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix, null);
  }

  requestMangaChapters(id: string) {
    this.fixUrl = 'chapter-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix, null);
  }

  requestDataUsers(id: string, token: string) {
    this.fixUrl = 'user-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    const headerparam = {
      Authorization: 'Bearer ' + token
    };
    return this.requestData(urlFix, headerparam);
  }

  sendFavorite(mid: string, token: string, current: any) {
    const param = new HttpParams()
                    .set('todo', current);
    return this.sendDataUsers(mid, token, 1, param);
  }

  sendDataUsers(mid: string, token: string, type: number, param: any) {
    this.fixUrl = 'user/' + type + '/' + mid + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    const headerparam = {
      Authorization: 'Bearer ' + token
    };
    return this.sendData(urlFix, headerparam, param);
  }

  requestData(theLink: string, header: any) {
    const httpOptions = {
      headers: header,
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.get<any>(theLink, httpOptions);
  }

  sendData(theLink: string, header: any, param: any) {
    const httpOptions = {
      headers: header,
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.post<any>(theLink, param, httpOptions);
  }


}
