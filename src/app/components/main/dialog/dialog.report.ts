import { environment } from './../../../../environments/environment.prod';
import { Component, Inject, ViewChild } from '@angular/core';
import { AuthService } from './../../../services/auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, map, tap, last } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { DialogService } from './dialog.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

export interface DialogData {
  issueRequest: number;
  dialogData: any;
  issueID: any;
}

@Component({
  selector: 'manga-dialog-report',
  templateUrl: './dialog.report.html',
  styleUrls: ['./dialog.style.scss'],
})
export class ChapterReportDialogComponent {
  formIssue: FormGroup = this.formBuilder.group({
      suggest: [
      '', []
      ],
      attach: [
        '', []
      ]
  });
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
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
    this.resetFiles();
    for (const data in files) {
      if (!isNaN(parseInt(data, 10))) {
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

  handleError(file) {
    console.log(file);
  }

  async submitIssue() {
    this.dialogStep = 3;
    this.stats = 'Uploading';
    this.uploading = true;

    const getSuggest = this.formIssue.controls.suggest.value;
    this.progress = this.dialogService.upload(this.files, getSuggest, this.issueSelected, this.data.issueID);

    let countFiles = 0;
    this.files.forEach(file => {
      countFiles++;
    });
    // let currentProgress: number[];
    // let currentProgressFix = 0;
    // console.log(this.progress);
    // tslint:disable-next-line: forin
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => {
        console.log(val);
        // this.stats = 'Uploading:;
      });
    }

    // convert the progress map into an array
    const allProgressObservables = [];
    // tslint:disable-next-line: forin
    for (const key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    if (countFiles > 0) {
      // The OK-button should have the text "Finish" now
      this.primaryButtonText = 'Finish';

      // The dialog should not be closed while uploading
      this.canBeClosed = false;
      this.dialogRef.disableClose = true;

      // Hide the cancel-button
      this.showCancelButton = false;

      // When all progress-observables are completed...
      forkJoin(allProgressObservables).subscribe(end => {
        // ... the dialog can be closed again...
        /* this.canBeClosed = true;
        this.dialogRef.disableClose = false;

        // ... the upload was successful...
        this.uploadSuccessful = true;

        // ... and the component is no longer uploading
        this.uploading = false;

        this.stats = 'Uploading: Finish'; */
        this.onDone();
      });
    } else {
      this.onDone();
    }
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
