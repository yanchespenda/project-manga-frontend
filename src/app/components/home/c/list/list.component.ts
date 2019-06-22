import { ListService } from './list.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

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
  selector: 'manga-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
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
export class ListComponent implements OnInit {
  isLoad = true;
  theList: any[];

  constructor(
    private listService: ListService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log('list init');
    this.callReq();
  }

  getCover(image: string) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
    return '';
  }

  callReq() {
    this.isLoad = true;
    // this.isError = false;
    this.listService.requestData().pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.error !== undefined) {
          // this.isError = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.theList = jsonData.data.list;
            console.log(this.theList);
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
  }

}
