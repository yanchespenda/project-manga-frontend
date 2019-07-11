import { AuthService } from './../../../services/auth/auth.service';
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
  ishideTopNav = false;
  isLogin = false;
  currentUser: any;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    iconRegistry.addSvgIcon(
      'menu-24px',
      this.getImgResource('assets/icons-md/baseline-menu-24px.svg'));
    iconRegistry.addSvgIcon(
      'setting-24px',
      this.getImgResource('assets/icons-md/baseline-settings-24px.svg'));
  }

  getImgResource(image: string) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
    return '';
  }

  toogle_humbeger() {
    if (this.isStarting) {
      this.isStarting = false;
    } else {
      this.isStarting = true;
    }
  }

  getIsLogin() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser !== null) {
      this.isLogin = true;
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
        if (event.hideTopNav !== undefined) {
          if (event.hideTopNav) {
            this.ishideTopNav = true;
          } else {
            this.ishideTopNav = false;
          }
        } else {
          this.ishideTopNav = false;
        }
        console.log(event);
      });
    this.getIsLogin();
  }

}
