import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  baseUrl = 'https://project-manga.oo/v1/manga/manga-';
  fixUrl: string;

  constructor( private http: HttpClient ) { }

  requestMangaA(id: string) {
    this.fixUrl = id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix);
  }

  requestMangaInfo(id: string) {
    this.fixUrl = 'information-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix);
  }

  requestData(theLink: string) {
    const httpOptions = {
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.get<any>(theLink, httpOptions);
  }


}
