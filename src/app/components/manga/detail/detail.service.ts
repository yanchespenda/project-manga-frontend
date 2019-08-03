import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  baseUrl = environment.base_api_url +  environment.base_api_version + '/manga/manga-';
  fixUrl: string;

  constructor(
    private http: HttpClient
  ) {

  }

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

  requestMangaRecom(id: string) {
    this.fixUrl = 'recomended-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix, null);
  }

  requestDataUsers(id: string) {
    this.fixUrl = 'user-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    const headerparam  = { };
    return this.requestData(urlFix, headerparam);
  }

  sendFavorite(mid: string, current: any) {
    const param = new HttpParams()
                    .set('todo', current);
    return this.sendDataUsers(mid, 1, param);
  }

  sendSubscribe(mid: string, current: any) {
    const param = new HttpParams()
                    .set('todo', current);
    return this.sendDataUsers(mid, 2, param);
  }

  sendDataUsers(mid: string, type: number, param: any) {
    this.fixUrl = 'user/' + type + '/' + mid + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    const headerparam = new HttpHeaders({
      'Content-Type':  'application/x-www-form-urlencoded'
    });
    return this.sendData(urlFix, headerparam, param);
  }

  requestData(theLink: string, header: any) {
    let headerparam;
    let httpOptions = {
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
