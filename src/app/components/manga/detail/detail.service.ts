import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.requestData(urlFix);
  }

  requestMangaInfo(id: string) {
    this.fixUrl = 'information-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix);
  }

  requestMangaStats(id: string) {
    this.fixUrl = 'stats-' + id + '.json';
    const urlFix = this.baseUrl + this.fixUrl;
    return this.requestData(urlFix);
  }

  requestMangaChapters(id: string) {
    this.fixUrl = 'chapter-' + id + '.json';
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
