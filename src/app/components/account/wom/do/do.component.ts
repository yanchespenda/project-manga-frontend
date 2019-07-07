import { environment } from './../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'manga-do',
  templateUrl: './do.component.html',
  styleUrls: ['./do.component.scss'],
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
export class DoComponent implements OnInit {
  webData = {
    name: environment.nameWeb
  };
  dataInit = {
    E: false,
    T: false,
    N: false,
    D: false
  };
  isLoading = false;
  doError = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const dataE = this.activatedRoute.snapshot.queryParams.e || false;
    const dataT = this.activatedRoute.snapshot.queryParams.t || false;
    const dataN = this.activatedRoute.snapshot.queryParams.n || false;
    const dataD = this.activatedRoute.snapshot.queryParams.do || false;

    this.dataInit.E = dataE;
    this.dataInit.T = dataT;
    this.dataInit.N = dataN;
    this.dataInit.D = dataD;

    if (!dataD || dataD < 1 || dataD > 2) {
      this.doError = true;
    }

    console.group('Do Init:');
    console.log('dataE:', dataE);
    console.log('dataT:', dataT);
    console.log('dataN:', dataN);
    console.log('dataD:', dataD);
    console.groupEnd();
  }

}
