import { Component, OnInit, Input } from '@angular/core';

import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';

import { HeadMenu } from './app-header-menu-model';
import { AppHeaderMenuService } from './app-header-menu.service';

@Component({
  selector: 'manga-app-header-menu',
  templateUrl: './app-header-menu.component.html',
  styleUrls: ['./app-header-menu.component.scss']
})
export class AppHeaderMenuComponent implements OnInit {

  menus: any;

  constructor(
    private appHeaderMenuService: AppHeaderMenuService,
    private router: Router) {

  }

  navigateToRoute(path: string) {
    this.router.navigate([ path ]);
  }

  ngOnInit() {
    const test = this.appHeaderMenuService.requestHeadMenu();
    // console.log(test);
    this.menus = test;
  }

}
