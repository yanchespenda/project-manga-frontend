
import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  Event,
  NavigationCancel,
  NavigationError,
  NavigationStart,
} from '@angular/router';

import { Title } from '@angular/platform-browser';

import { filter, map, mergeMap  } from 'rxjs/operators';

@Component({
  selector: 'manga-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoading = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          console.log('route start');
          this.isLoading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          console.log('route finish');
          this.isLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
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
        // if (event.isMenuHidden !== undefined) {
        //   if (event.isMenuHidden) {
        //     this.appHeaderService.changeIsMenuHidde(true);
        //   } else {
        //     this.appHeaderService.changeIsMenuHidde(false);
        //   }
        // } else {
        //   this.appHeaderService.changeIsMenuHidde(false);
        // }
        console.log(event);
        this.titleService.setTitle(event.title);
      });
  }


}
