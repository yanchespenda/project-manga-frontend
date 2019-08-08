import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatTabChangeEvent, MatSnackBar, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { DetailService } from './detail.service';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './../../../services/auth/auth.service';
import { ChapterReportDialogComponent } from './../../main/dialog/dialog.report';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { FormControl } from '@angular/forms';

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
  tabSelectedIndex = new FormControl(0);
  isNotFound = false;
  isLoad = false;
  isDone = false;
  isLoadCards = {
    x: false,
    a: false,
    b: false,
    c: false
  };
  isPreloadCards = {
    x: true,
    a: true,
    b: true,
    c: true
  };
  isLogin = false;
  isErrorCards = {
    x: false,
    a1: false,
    a2: false,
    b: false,
    c: false
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
  dialogData: any;
  dataRecom: any = [];
  isFavoriteRun = false;
  isSubscribeRun = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private detailService: DetailService,
    private titleTab: Title,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
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

  openDialog(): void {
    const dialogRef = this.matDialog.open(ChapterReportDialogComponent, {
      width: '450px',
      data: {
        issueRequest: 1,
        dialogData: this.dialogData,
        issueID: this.CURRENT_ID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // this.messageData.txt = result;
      if (result === null) {
        this.openDialog();
      } else if (result === false) {
        // this.temporaryData.username = result;
        // this.SubmitE();
      }

    });
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
      if (!this.tabLoadTimes[this.tabActiveIndex]) {
        this.tabLoadTimes[this.tabActiveIndex] = new Date();
        if (this.tabActiveIndex === 0) {
          this.initInfo();
        } else if (this.tabActiveIndex === 1) {
          this.initStats();
        }
        if (!this.chapterFirstLoad) {
          this.initChapters();
        }
      }
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabActiveIndex = tabChangeEvent.index;
    this.runTabs();
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

  async initInfo() {
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
        // console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoadCards.a = false;
        this.isPreloadCards.a = false;
      }
    );
  }

  async initStats() {
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
        // console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoadCards.a = false;
        this.isPreloadCards.a = false;
      }
    );
  }

  async initChapters() {
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
        // console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoadCards.b = false;
        this.isPreloadCards.b = false;
      }
    );
  }

  async initManga() {
    this.isPreloadCards = {
      x: true,
      a: true,
      b: true,
      c: true
    };
    this.isErrorCards.x = false;
    this.detailService.requestMangaA(this.CURRENT_ID)
    .pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
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
            this.dialogData = this.dataMangaA.title;
            this.runTabs();
            if (this.isLogin) {
              this.initUserData();
            }
            this.initRecom();
          } else {
            this.isErrorCards.x = true;
          }
        }
      },
      (err) => {
        this.isErrorCards.x = true;
        // console.error(err);
      },
      () => {
        // console.log('observable complete');
        this.isLoad = false;
        this.isLoadCards.x = false;
        this.isPreloadCards.x = false;
      }
    );
  }

  async initRecom() {
    // requestMangaRecom
    this.isErrorCards.c = false;
    this.isLoadCards.c = true;
    this.detailService.requestMangaRecom(this.CURRENT_ID)
    .pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        if (jsonData.error !== undefined) {
          // this.isErrorCards.x = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            // this.isDone = true;
            // console.log(jsonData);
            this.dataRecom = jsonData.data.recom;
          } else {
            // this.isErrorCards.x = true;
          }
        }
      },
      (err) => {
        this.isErrorCards.c = true;
        // console.error(err);
      },
      () => {
        this.isLoadCards.c = false;
        this.isPreloadCards.c = false;
        // console.log('observable complete');
        // this.isLoad = false;
      }
    );
  }

  async toggleFavorite() {
    if (!this.isFavoriteRun) {
      this.isFavoriteRun = true;
      this.detailService.sendFavorite(this.CURRENT_ID, this.dataUser.favorite).pipe(
        catchError(val => of(val))
      ).subscribe(
        (jsonData) => {
          // console.log(jsonData);
          if (jsonData.error !== undefined) {
            // this.isErrorCards.b = true;
          } else {
            if (jsonData.status !== undefined && jsonData.status) {
              this.dataUser.favorite = jsonData.data.set;
              this.matSnackBar.open(jsonData.data.msg, 'close', {
                duration: 3000
              });
            } else {
              // this.isErrorCards.b = true;
            }
          }
        },
        (err) => {
          this.isFavoriteRun = false;
          // console.error(err);
        },
        () => {
          this.isFavoriteRun = false;
        }
      );
    }
  }

  async toggleSubscribe() {
    if (!this.isSubscribeRun) {
      this.isFavoriteRun = true;
      this.detailService.sendSubscribe(this.CURRENT_ID, this.dataUser.subscribe).pipe(
        catchError(val => of(val))
      ).subscribe(
        (jsonData) => {
          console.log(jsonData);
          if (jsonData.error !== undefined) {
            // this.isErrorCards.b = true;
          } else {
            if (jsonData.status !== undefined && jsonData.status) {
              this.dataUser.subscribe = jsonData.data.set;
              this.matSnackBar.open(jsonData.data.msg, 'close', {
                duration: 3000
              });
            } else {
              // this.isErrorCards.b = true;
            }
          }
        },
        (err) => {
          this.isSubscribeRun = false;
          // console.error(err);
        },
        () => {
          this.isSubscribeRun = false;
        }
      );
    }
  }

  async initUserData() {
    this.detailService.requestDataUsers(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
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
        // console.error(err);
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

  resetData() {
    this.tabLoadTimes = [];
    this.tabActiveIndex = 0;
    this.tabSelectedIndex.setValue(0);
    this.isNotFound = false;
    this.isLoad = false;
    this.isDone = false;
    this.isLoadCards = {
      x: false,
      a: false,
      b: false,
      c: false
    };
    this.isLogin = false;
    this.isErrorCards = {
      x: false,
      a1: false,
      a2: false,
      b: false,
      c: false
    };
    this.chapterFirstLoad = false;

    this.dataMangaA = {
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

    this.dataTabA = {
      genre: [],
      summary: 'loading...',
      type: '',
      releasedate: '',
      othername: '',
      latest: ''
    };

    this.dataTabB = {
      views_total: 0,
      views_day: 0,
      user_subscribes: 0,
      user_favorites: 0
    };

    this.dataChapters = {
      list: []
    };

    this.dataUser = {
      favorite: false,
      subscribe: false
    };

    this.dataRecom = [];

    this.isFavoriteRun = false;
    this.isSubscribeRun = false;
  }

  reloadManga(id) {
    this.CURRENT_ID = id;
    this.resetData();
    this.isLoad = true;
    this.getIsLogin();
    this.initManga();
  }

  ngAfterViewInit() {
    // console.log(this.tabGroup.selectedIndex);
  }

  ngOnInit() {
    this.isLoad = true;
    this.CURRENT_ID = this.activatedRoute.snapshot.paramMap.get('id');
    this.getIsLogin();
    this.initManga();

    // this.activatedRoute.snapshot.
  }

}
