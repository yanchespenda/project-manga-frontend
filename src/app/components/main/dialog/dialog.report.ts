import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  reportRequest: number;
}

@Component({
  selector: 'manga-dialog-report',
  templateUrl: './dialog.report.html',
  styleUrls: ['./dialog.style.scss'],
})
export class ChapterReportDialogComponent {
  /* loginFormDialogA: FormGroup = this.formBuilder.group({
      email: [
      '', [Validators.required, Validators.email]
      ]
  }); */
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(
    public dialogRef: MatDialogRef<ChapterReportDialogComponent>,
    // private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }

  getErrorMessage() {
    // if (this.loginFormDialogA.controls.email.hasError('required')) {
    //   return 'Please input your email';
    // } else if (this.loginFormDialogA.controls.email.hasError('email')) {
    //   return 'Email not valid';
    // }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    // this.dialogRef.close(this.loginFormDialogA.controls.email.value);
  }

}