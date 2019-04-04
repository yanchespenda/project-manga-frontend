import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'manga-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss']
})
export class PopularComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('popular init');
  }

}
