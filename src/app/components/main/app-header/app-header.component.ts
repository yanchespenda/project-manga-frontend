import { AuthService } from './../../../services/auth/auth.service';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
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
  isUseChapterNav = false;
  currentUser: any;
  navbarLogo: string;

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
      // this.navbarLogo = this.getImgResource('assets/icons-md/baseline-settings-24px.svg');
  }

  navBarSet(url) {
    // this.navbarLogo = this.getImgResource('assets/images/angular-white-transparent.svg');
    this.navbarLogo = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(url));
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
    this.navBarSet('assets/images/angular-white-transparent.svg');
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
        if (event.useChapterNav !== undefined) {
          if (event.useChapterNav) {
            this.isUseChapterNav = true;
          } else {
            this.isUseChapterNav = false;
          }
        } else {
          this.isUseChapterNav = false;
        }
        // console.log(event);
      });
    this.getIsLogin();
  }

}
