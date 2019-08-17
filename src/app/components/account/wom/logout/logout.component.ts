import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { environment } from './../../../../../environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'manga-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private renderer2: Renderer2,
  ) {
    this.renderer2.addClass(this.document.body, 'oauth-mode');
    this.renderer2.addClass(this.document.body, 'oauth-logout-mode');
  }

  logoutCallback(data) {
    if (data) {
      window.open('/', '_self');
    } else {
      this.matSnackBar.open('Failed to logout', 'exit', {
        duration: 5000
      });
    }
  }

  ngOnInit() {
    this.authService.logout(this.logoutCallback);
  }

  ngOnDestroy() {
    this.renderer2.removeClass(this.document.body, 'oauth-mode');
    this.renderer2.removeClass(this.document.body, 'oauth-logout-mode');
  }

}
