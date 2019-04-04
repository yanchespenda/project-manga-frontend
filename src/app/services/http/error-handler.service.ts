import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(public snackbar: MatSnackBar) { }

  public handleError(err: any) {
    this.snackbar.open(err.message, 'close');
  }
}
