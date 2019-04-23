import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

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

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {

    iconRegistry.addSvgIcon('more_vert', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-more_vert-24px.svg'));
    iconRegistry.addSvgIcon('flag', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-flag-24px.svg'));
    iconRegistry.addSvgIcon('notifications', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-notifications-24px.svg'));
    iconRegistry.addSvgIcon('favorite', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-favorite-24px.svg'));
    iconRegistry.addSvgIcon('favorite_border',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-favorite_border-24px.svg'));
    iconRegistry.addSvgIcon('share', sanitizer.bypassSecurityTrustResourceUrl('assets/icons-md/baseline-share-24px.svg'));
  }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }

}
