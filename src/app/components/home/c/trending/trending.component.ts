import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TrendingService } from './trending.service';

import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'manga-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  animations: [
    trigger('loadingAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate( 150 )
      ]),
      transition(':leave',
        animate( 150, style({opacity: 0})))
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':leave', [
          stagger(100, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ]),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ])
      ])
    ])
  ]
})
export class TrendingComponent implements OnInit {
  sortSelected = '1';
  isLoad = false;
  isError = false;
  tiles: any[];

  constructor(
      private sanitizer: DomSanitizer,
      private trendingService: TrendingService
    ) {

    }

  getBackground(bool: any, image: string) {
    if (bool) {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }
    return '';
  }

  topRefresh(event: any) {
    this.callReq();
  }

  ngOnInit() {
    console.log('trending init');
    this.callReq();
  }

  callReq() {
    this.isLoad = true;
    this.isError = false;
    this.trendingService.requestDataBySort(this.sortSelected).pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isError = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.tiles = jsonData.data.list;
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
