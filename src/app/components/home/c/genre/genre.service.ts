import { environment } from './../../../../../environments/environment';
import { GenreModel } from './genre.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  baseUrl = 'https://project-manga.oo/v1/home/genre.json';

  constructor( private http: HttpClient ) {

  }

  public requestData() {
    const httpOptions = {
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.get<GenreModel>(this.baseUrl, httpOptions);
  }
}
