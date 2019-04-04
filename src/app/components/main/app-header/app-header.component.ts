import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'manga-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  isSideBySide = false;
  isStarting = false;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'menu-24px',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-menu-24px.svg'));
  }

  toogle_humbeger() {
    if (this.isStarting) {
      this.isStarting = false;
    } else {
      this.isStarting = true;
    }
  }

  ngOnInit() {
  }

}
