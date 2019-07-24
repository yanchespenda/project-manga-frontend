import { environment } from './../../../../environments/environment.prod';
import { Component, Inject, ViewChild } from '@angular/core';
import { AuthService } from './../../../services/auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, map, tap, last } from 'rxjs/operators';
import { of } from 'rxjs';

export interface DialogData {
  issueRequest: number;
  dialogData: any;
}

@Component({
  selector: 'manga-dialog-report',
  templateUrl: './dialog.report.html',
  styleUrls: ['./dialog.style.scss'],
})
export class ChapterReportDialogComponent{
  /* loginFormDialogA: FormGroup = this.formBuilder.group({
      email: [
      '', [Validators.required, Validators.email]
      ]
  }); */
  @ViewChild('file', { static: false }) file;
  public files: Set<File> = new Set();
  dialogStep = 1;
  issues: any = [];
  currentUser: any;
  isLogged: boolean;
  issueSelected: number;
  baseUrl = environment.base_api_url +  environment.base_api_version + '/issue/';
  progress: any;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  stats: any;

  constructor(
    public dialogRef: MatDialogRef<ChapterReportDialogComponent>,
    private http: HttpClient,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.currentUser = authService.currentUserValue;
    if (this.currentUser !== null) {
      this.isLogged = true;
    }
    this.loadIssue();
  }

  getCurrentSelectedIssue() {
    if (this.issueSelected) {
      for (const data of this.issues) {
        if (data.id.toString() === this.issueSelected.toString()) {
          return data.name;
        }
      }
    }
    return 'unknown';
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const data in files) {
      if (!isNaN(parseInt(data))) {
        this.resetFiles();
        this.files.add(files[data]);
      }
    }
  }

  resetFiles() {
    this.files.clear();
  }

  /* getUploadName() {
    if (this.files !== undefined) {
      if (this.files[0].name !== undefined) {
        return this.files[0].name;
      }
    }
    return '';
  } */

  getErrorMessage() {
    // if (this.loginFormDialogA.controls.email.hasError('required')) {
    //   return 'Please input your email';
    // } else if (this.loginFormDialogA.controls.email.hasError('email')) {
    //   return 'Email not valid';
    // }
  }

  async loadIssue() {
    this.dataGet(this.baseUrl + 'types/' + this.data.issueRequest, null)
    .pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
        if (jsonData.error !== undefined && jsonData.error !== 0) {
          // this.isErrorCards.x = true;
          if (jsonData.error === 404) {
            // this.isNotFound = true;
          }
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            const chapterData = jsonData.data;

            this.issues = chapterData;
            // this.isDone = true;

            // setTimeout(() => {
            //   this.chapterSelected = chapterData.chapter_selected;
            //   // this.chapterSelected = 10;
            //   this.setCanvasList();
            //   this.canvasInit();
            // }, 100);
            console.log(this.issues);
          } else {
            // this.isErrorCards.x = true;
          }
        }
      },
      (err) => {
        // this.isErrorCards.x = true;
        console.error(err);
      },
      () => {
        // this.isLoading = false;
      }
    );
  }

  showProgress(msg) {
    this.stats = msg;
  }

  handleError(file){
    console.log(file);
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  submitIssue() {
    this.dialogStep = 3;
    this.files.forEach(file => {
      const req = new HttpRequest('POST', 'https://project-manga.oo/v1/issue/submit', file, {
        reportProgress: true
      });
      this.http.request(req).pipe(
        map(event => this.getEventMessage(event, file)),
        tap(message => this.showProgress(message)),
        last(), // return last (completed) message to caller
        catchError(val => of(val))
      );

    });
    /* this.uploading = true;

    const LINK = 'https://project-manga.oo/v1/issue/submit';
    const formData: FormData = new FormData();
    let attachFile: any;
    this.files.forEach(file => {
      formData.append('attach', file, file.name);
      attachFile = file;
    });
    // const data = new HttpParams()
    //               .set('type', this.issueSelected.toString())
    //               .set('attach', attachFile);
    formData.append('type', this.issueSelected.toString());
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      }),
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    this.http.post<any>(LINK, formData, httpOptions)
      .pipe(
        catchError(val => of(val))
      )
      .subscribe(
        (jsonData) => {
          this.dialogStep = 3;
          console.log(jsonData);
        },
        (err) => {
          // this.isErrorCards.x = true;
          console.error(err);
        },
        () => {
          // this.isLoading = false;
        }
      ); */
    /* this.dataPost(LINK, )
      .pipe(
        catchError(val => of(val))
      ); */
    /*
                  .set('password', password)
                  .set('rtoken', rtoken) */
    // start the upload and save the progress map
    // this.progress = this.uploadService.upload(this.files);
    // console.log(this.progress);
    // for (const key in this.progress) {
    //   this.progress[key].progress.subscribe(val => console.log(val));
    // }
  }

  dataGet(theLink: string, header: any) {
    const httpOptions = {
      headers: header,
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    if (this.isLogged) {
      httpOptions.headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.currentUser.token
      });
    }
    return this.http.get<any>(theLink, httpOptions);
  }

  dataPost(theLink: string, header: any, param: any) {
    const httpOptions = {
      headers: header,
      withCredentials: environment.REQUEST_CREDENTIALS
    };
    return this.http.post<any>(theLink, param, httpOptions);
  }

  sendData(url: string, data: any, option: any) {
    return this.http.post<any>(url, data, option);
  }

  onNext(): void {
    if (this.dialogStep === 1) {
      this.dialogStep = 2;
    } else {
      // this.canBeClosed = false;
      this.dialogRef.disableClose = true;
      this.dialogStep = 1;
    }

  }

  onDone(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.submitIssue();
    // this.dialogStep = 3;
    // this.onNext();
    // this.dialogRef.close(this.loginFormDialogA.controls.email.value);
  }
}
