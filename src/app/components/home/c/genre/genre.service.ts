import { environment } from './../../../../../environments/environment';
import { GenreModel } from './genre.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  baseUrl = environment.base_api_url + environment.base_api_version + '/home/genre.json';

  constructor( private http: HttpClient ) {

  }

  public requestData() {
    const httpOptions = {
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.get<GenreModel>(this.baseUrl, httpOptions);
  }
}
