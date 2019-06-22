import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { filter, map, mergeMap  } from 'rxjs/operators';

import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  Event,
  NavigationCancel,
  NavigationError,
  NavigationStart,
} from '@angular/router';

@Component({
  selector: 'manga-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  isSideBySide = false;
  isStarting = true;
  isInit = true;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
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
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      ).subscribe((event) => {
        this.isInit = false;
        if (event.isMenuHidden !== undefined) {
          if (event.isMenuHidden) {
            this.isStarting = true;
          } else {
            this.isStarting = false;
          }
        } else {
          this.isStarting = false;
        }
        console.log(event);
      });
  }

}
