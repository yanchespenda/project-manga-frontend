import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'manga-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(this.document.body, 'reader-mode');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'reader-mode');
  }

}
