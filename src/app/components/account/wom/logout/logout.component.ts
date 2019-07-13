import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { environment } from './../../../../../environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';

@Component({
  selector: 'manga-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.authService.logout()) {
      window.open('/', '_self');
    } else {
      this.matSnackBar.open('Failed to logout', 'exit', {
        duration: 3000
      });
    }
  }

}
