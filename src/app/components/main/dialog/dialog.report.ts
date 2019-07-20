import { environment } from './../../../../environments/environment.prod';
import { Component, Inject, ViewChild } from '@angular/core';
import { AuthService } from './../../../services/auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
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
  favoriteSeason: string;
  issues: any = [];
  currentUser: any;
  isLogged: boolean;
  issueSelected: number;
  baseUrl = environment.base_api_url +  environment.base_api_version + '/issue/';

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

  loadIssue() {
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

  onNext(): void {
    if (this.dialogStep === 1) {
      this.dialogStep = 2;
    } else {
      // this.canBeClosed = false;
      this.dialogRef.disableClose = true;
      this.dialogStep = 1;
    }

  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.onNext();
    // this.dialogRef.close(this.loginFormDialogA.controls.email.value);
  }
}
