import { AuthService } from './../../../services/auth/auth.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatTabChangeEvent} from '@angular/material';
import { Title } from '@angular/platform-browser';
import { DetailService } from './detail.service';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'manga-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [
    trigger('loadingAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate( 150 )
      ]),
      transition(':leave',
        animate( 150, style({opacity: 0})))
    ])
  ]
})
export class DetailComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroupManga', {static: false}) tabGroup;
  tabLoadTimes: Date[] = [];
  tabActiveIndex = 0;
  isNotFound = false;
  isLoad = false;
  isDone = false;
  isLoadCards = {
    a: false,
    b: false
  };
  isLogin = false;
  isErrorCards = {
    x: false,
    a1: false,
    a2: false,
    b: false
  };
  chapterFirstLoad = false;
  CURRENT_ID: any;
  currentUser: any;

  dataMangaA: any = {
    id: 0,
    title: 'loading...',
    chapter: 0,
    status: 'unknown',
    type: 'unknown',
    author: [],
    img_cvr: {
      enabled: false,
      thumb: '',
      full: ''
    },
    img_bg: {
      enabled: false,
      link: ''
    }
  };

  dataTabA: any = {
    genre: [],
    summary: 'loading...',
    type: '',
    releasedate: '',
    othername: '',
    latest: ''
  };

  dataTabB: any = {
    views_total: 0,
    views_day: 0,
    user_subscribes: 0,
    user_favorites: 0
  };

  dataChapters: any = {
    list: []
  };

  dataUser: any = {
    favorite: false,
    subscribe: false
  };

  isFavoriteRun = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private detailService: DetailService,
    private titleTab: Title,
    private cookieService: CookieService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar
  ) {

    iconRegistry.addSvgIcon('more_vert',
      this.getImgResource('assets/icons-md/baseline-more_vert-24px.svg'));
    iconRegistry.addSvgIcon('flag',
      this.getImgResource('assets/icons-md/baseline-flag-24px.svg'));
    iconRegistry.addSvgIcon('notifications',
      this.getImgResource('assets/icons-md/baseline-notifications-24px.svg'));
    iconRegistry.addSvgIcon('notifications_off',
      this.getImgResource('assets/icons-md/baseline-notifications_off-24px.svg'));
    iconRegistry.addSvgIcon('favorite',
      this.getImgResource('assets/icons-md/baseline-favorite-24px.svg'));
    iconRegistry.addSvgIcon('favorite_border',
      this.getImgResource('assets/icons-md/baseline-favorite_border-24px.svg'));
    iconRegistry.addSvgIcon('share',
      this.getImgResource('assets/icons-md/baseline-share-24px.svg'));
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
      this.runTabs();
    }
    return this.tabLoadTimes[index];
  }

  runTabs() {
    if (this.isDone) {
      if (this.tabActiveIndex === 0) {
        this.initInfo();
      } else if(this.tabActiveIndex === 1) {
        this.initStats();
      }
      if (!this.chapterFirstLoad) {
        this.initChapters();
      }
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabActiveIndex = tabChangeEvent.index;
    // console.log(tabChangeEvent);
  }

  setTabTitle(title: string) {
    this.titleTab.setTitle(title);
  }

  getImgResource(image: string) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
    return '';
  }

  getStyleResource(data: string) {
    if (data) {
      return this.sanitizer.bypassSecurityTrustStyle(data);
    }
    return '';
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(transparent, rgba(0, 0, 0, 0.7)), url(${ image })`);
  }

  initInfo() {
    this.isLoadCards.a = true;
    this.isErrorCards.a1 = false;
    this.detailService.requestMangaInfo(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isErrorCards.a1 = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.dataTabA = jsonData.data;
          } else {
            this.isErrorCards.a1 = true;
          }
        }
      },
      (err) => {
        this.isErrorCards.a1 = true;
        console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoadCards.a = false;
      }
    );
  }

  initStats() {
    this.isLoadCards.a = true;
    this.isErrorCards.a2 = false;
    this.detailService.requestMangaStats(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isErrorCards.a2 = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.dataTabB = jsonData.data;
          } else {
            this.isErrorCards.a2 = true;
          }
        }
      },
      (err) => {
        this.isErrorCards.a2 = true;
        console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoadCards.a = false;
      }
    );
  }

  initChapters() {
    this.isLoadCards.b = true;
    this.isErrorCards.b = false;
    this.detailService.requestMangaChapters(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isErrorCards.b = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.chapterFirstLoad = true;
            this.dataChapters = jsonData.data;
          } else {
            this.isErrorCards.b = true;
          }
        }
      },
      (err) => {
        this.isErrorCards.b = true;
        console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoadCards.b = false;
      }
    );
  }

  initManga() {
    this.isErrorCards.x = false;
    this.detailService.requestMangaA(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isErrorCards.x = true;
          if (jsonData.error === 404) {
            this.isNotFound = true;
            this.setTabTitle(jsonData.message);
          }
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.isDone = true;
            this.dataMangaA = jsonData.data;
            this.setTabTitle(this.dataMangaA.title);
            // console.log(this.dataMangaA);
            this.runTabs();

            if (this.isLogin) {
              this.initUserData();
            }
          } else {
            this.isErrorCards.x = true;
          }
        }
      },
      (err) => {
        this.isErrorCards.x = true;
        console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoad = false;
      }
    );
  }

  toggleFavorite() {
    if (!this.isFavoriteRun) {
      this.isFavoriteRun = true;
      if (this.dataUser.favorite) {
        this.dataUser.favorite = false;
      } else {
        this.dataUser.favorite = true;
      }
      this.detailService.sendFavorite(this.CURRENT_ID, this.currentUser.token, this.dataUser.favorite).pipe(
        catchError(val => of(val))
      ).subscribe(
        (jsonData) => {
          console.log(jsonData);
          if (jsonData.error !== undefined) {
            // this.isErrorCards.b = true;
          } else {
            if (jsonData.status !== undefined && jsonData.status) {
              // this.chapterFirstLoad = true;
              this.matSnackBar.open('Favorite updated', 'close');
            } else {
              // this.isErrorCards.b = true;
            }
          }
        },
        (err) => {
          // this.isErrorCards.b = true;
          console.error(err);
        },
        () => {
          this.isFavoriteRun = false;
          // console.log('observable complete');
          // this.isLoadCards.b = false;
        }
      );
    }
    // c this.snackbar.open(err.message, 'close'); sendFavorite

  }

  initUserData() {
    this.detailService.requestDataUsers(this.CURRENT_ID, this.currentUser.token).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.error !== undefined) {
          // this.isErrorCards.b = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            // this.chapterFirstLoad = true;
            this.dataUser = jsonData.data;
          } else {
            // this.isErrorCards.b = true;
          }
        }
      },
      (err) => {
        // this.isErrorCards.b = true;
        console.error(err);
      },
      () => {
        // console.log('observable complete');
        // this.isLoadCards.b = false;
      }
    );
  }


  getIsLogin() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser !== null) {
      this.isLogin = true;
      // this.initUserData();
    }
  }

  ngAfterViewInit() {
    console.log(this.tabGroup.selectedIndex);
    this.getIsLogin();
  }

  ngOnInit() {
    this.isLoad = true;
    this.CURRENT_ID = this.activatedRoute.snapshot.paramMap.get('id');
    this.initManga();

    const setUser = {
      id: 1,
      username: 'string;',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOlwvXC9wcm9qZWN0LW1hbmdhLm9vXC8iLCJhdWQiOiJodHRwOlwvXC9wcm9qZWN0LW1hbmdhLm9vXC8iLCJpYXQiOjE1NjE0NTU2NzYsIm5iZiI6MTU2MTQ1NTY3NywiZXhwIjoxNTY0MDQ3Njc2LCJjbG0iOiJleUpwZGlJNklreENiVEoyTW1kb1oxbERXRlpoWjNaSlNrSmNMMlZuUFQwaUxDSjJZV3gxWlNJNklscENjR0l6ZDBKamNIUnNNRFp3ZUZWalJrMU5lbUZVZFZoUk4wdFhVMGxEYjNOd05tTm9OWFY0VG04OUlpd2liV0ZqSWpvaU5USXhOekptTkdWaFpqWXdOVGxrWTJaalpHWmtOek0zWldVNVlXWTRObVV4T1RSak1XRXpPREZsTTJZeU4yRTJaVGd5WkRrd05EVmxOamd6TURabU5pSjkifQ.qFyTIV-PXdebHSFP05GnTCZIYuDRWZ-s3BYNZqq_JvpSPGqcxtnSo6QPplBpxS05sUD--0Hbd420904puBMBPQ'
    };
    // this.cookieService.set( 'currentUser', JSON.stringify(setUser) );
  }

}
