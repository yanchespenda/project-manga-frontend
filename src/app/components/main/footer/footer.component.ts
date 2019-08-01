import { Component, OnInit } from '@angular/core';
import { mergeMap, filter, map } from 'rxjs/operators';

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
  selector: 'manga-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isUseChapterNav = false;
  ishideTopNav: boolean;
  isStarting: boolean;
  isInit: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

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
  }

}
