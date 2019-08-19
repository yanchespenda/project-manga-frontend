import { GenreService } from './genre.service';
import { Component, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'manga-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
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
export class GenreComponent implements OnInit {
  isLoad = false;
  isError = false;
  isPreloadCards = true;
  genres: any;
  shimmer = [
    {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }, {
      1: false
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private genreService: GenreService
  ) {
    // console.log('genre cons');
  }

  ngOnInit() {
    this.genreLoad();
    // console.log('genre init');
  }

  topRefresh(event: any) {
    this.genreLoad();
  }

  genreLoad() {
    this.isLoad = true;
    this.isError = false;
    this.genreService.requestData().pipe(
      catchError(val => of(val))
    ).subscribe(
      (jsonData) => {
        console.log(jsonData);
        if (jsonData.error !== undefined) {
          this.isError = true;
        } else {
          if (jsonData.status !== undefined && jsonData.status) {
            this.genres = jsonData.data.list;
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
        // console.log('observable complete');
        this.isPreloadCards = false;
        this.isLoad = false;
      }
    );
  }


}
