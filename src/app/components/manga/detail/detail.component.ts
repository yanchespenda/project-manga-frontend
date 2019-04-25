import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
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
export class DetailComponent implements OnInit {
  tabLoadTimes: Date[] = [];
  isLoad = true;

  dataMangaA: any = {
    id: 0,
    title: 'loading...',
    chapter: 0,
    status: '',
    type: '',
    img_cvr: {
      enabled: false,
      thumb: '',
      full: ''
    },
    img_bg: {
      enabled: false,
      full: ''
    }
  };

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private detailService: DetailService,
    private titleTab: Title
  ) {

    iconRegistry.addSvgIcon('more_vert', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-more_vert-24px.svg'));
    iconRegistry.addSvgIcon('flag', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-flag-24px.svg'));
    iconRegistry.addSvgIcon('notifications', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-notifications-24px.svg'));
    iconRegistry.addSvgIcon('favorite', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-favorite-24px.svg'));
    iconRegistry.addSvgIcon('favorite_border',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-favorite_border-24px.svg'));
    iconRegistry.addSvgIcon('share', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-share-24px.svg'));
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

  ngOnInit() {
    const CURRENT_ID = this.activatedRoute.snapshot.paramMap.get('id');
    this.detailService.requestMangaA(CURRENT_ID).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.error !== undefined) {
          // this.isError = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.dataMangaA = jsonData.data;
            this.setTabTitle(this.dataMangaA.title);
            console.log(this.dataMangaA);
          } else {
            // this.isError = true;
          }
        }
      },
      (err) => {
        // this.isError = true;
        console.error(err);
      },
      () => {
        console.log('observable complete');
        this.isLoad = false;
      }
    );

    console.log(CURRENT_ID);
  }

}
