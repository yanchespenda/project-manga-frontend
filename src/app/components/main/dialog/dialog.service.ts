import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  url = 'https://project-manga.oo/v1/issue/submit';
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  public upload(
    files: Set<File>,
    suggest: any,
    issueSelected: any,
    issueId: any
  ): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};
    let countFiles = 0;
    files.forEach(file => {
      countFiles++;
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('suggest', suggest);
      formData.append('type', issueSelected);
      formData.append('target', issueId);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', this.url, formData, {
        headers: new HttpHeaders({
          // 'Content-Type': 'multipart/form-data'
        }),
        reportProgress: true,
        withCredentials: environment.REQUEST_CREDENTIALS
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          if (event.body !== undefined) {
            const jsonData: any = event.body;
            // console.log(jsonData);
            if (jsonData.status) {
              this.snackBar.open(jsonData.message, 'close', {duration: 5000});
            }
            // this.snackBar.open(err.message, 'close', {duration: 5000});
          }
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    if (countFiles === 0) {
      const formData: FormData = new FormData();
      formData.append('suggest', suggest);
      formData.append('type', issueSelected);
      formData.append('target', issueId);

      const req = new HttpRequest('POST', this.url, formData, {
        headers: new HttpHeaders({
          // 'Content-Type': 'multipart/form-data'
        }),
        reportProgress: true,
        withCredentials: environment.REQUEST_CREDENTIALS
      });

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

        } else if (event instanceof HttpResponse) {
          if (event.body !== undefined) {
            const jsonData: any = event.body;
            if (jsonData.status) {
              this.snackBar.open(jsonData.message, 'close', {duration: 5000});
            }
          }
        }
      });
    }

    // return the map of progress.observables
    return status;
  }
}
