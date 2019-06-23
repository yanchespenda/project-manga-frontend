import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatTabChangeEvent} from '@angular/material';
import { Title } from '@angular/platform-browser';
import {DetailService} from './detail.service';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  isError = false;
  isDone = false;
  isLoadCards = {
    a: false,
    b: false
  };
  isErrorCards = {
    a1: false,
    a2: false,
    b: false
  };
  CURRENT_ID: any;

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

  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private detailService: DetailService,
    private titleTab: Title
  ) {

    iconRegistry.addSvgIcon('more_vert',
      this.getImgResource('assets/icons-md/baseline-more_vert-24px.svg'));
    iconRegistry.addSvgIcon('flag',
      this.getImgResource('assets/icons-md/baseline-flag-24px.svg'));
    iconRegistry.addSvgIcon('notifications',
      this.getImgResource('assets/icons-md/baseline-notifications-24px.svg'));
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
    // console.log(this.tabActiveIndex);
    // console.log();
    return this.tabLoadTimes[index];
  }

  runTabs() {
    if (this.isDone) {
      if (this.tabActiveIndex === 0) {
        this.initInfo();
      } else if(this.tabActiveIndex === 1) {
        this.initStats();
      }
      this.initChapters();
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
    this.detailService.requestMangaInfo(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
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
        console.log('observable complete');
        this.isLoadCards.a = false;
      }
    );
  }

  initStats() {
    this.isLoadCards.a = true;
    this.detailService.requestMangaStats(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
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
        console.log('observable complete');
        this.isLoadCards.a = false;
      }
    );
  }

  initChapters() { // requestMangaChapters
    this.isLoadCards.b = true;
    this.detailService.requestMangaChapters(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isErrorCards.b = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            // this.dataTabB = jsonData.data;
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
        console.log('observable complete');
        this.isLoadCards.b = false;
      }
    );
  }

  ngAfterViewInit() {
    console.log(this.tabGroup.selectedIndex);
  }

  ngOnInit() {
    this.isLoad = true;
    this.CURRENT_ID = this.activatedRoute.snapshot.paramMap.get('id');
    this.detailService.requestMangaA(this.CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        // console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isError = true;
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
          } else {
            this.isError = true;
          }
        }
      },
      (err) => {
        this.isError = true;
        console.error(err);
      },
      () => {
        console.log('observable complete');
        this.isLoad = false;
      }
    );

  }

}
