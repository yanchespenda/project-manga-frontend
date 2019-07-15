import { WINDOW } from './../../../services/window/window.service';
import { Component, OnInit, OnDestroy, Renderer2, Inject,
  Input, ElementRef, AfterViewInit, ViewChild, QueryList, HostListener } from '@angular/core';
import { DOCUMENT, ViewportScroller,  } from '@angular/common';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise, map } from 'rxjs/operators';



@Component({
  selector: 'manga-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('renderContainer', { static: true }) renderContainer: ElementRef;
  sampleData: any = [
    {
      id: 1,
      img: 'https://project-manga.oo/storage/manga/2019/07/c01.png'
    },
    {
      id: 2,
      img: 'https://project-manga.oo/storage/manga/2019/07/c02.png'
    },
    {
      id: 3,
      img: 'https://project-manga.oo/storage/manga/2019/07/c03.png'
    },
    {
      id: 4,
      img: 'https://project-manga.oo/storage/manga/2019/07/c04.png'
    },
    {
      id: 5,
      img: 'https://project-manga.oo/storage/manga/2019/07/c05.png'
    },
    {
      id: 6,
      img: 'https://project-manga.oo/storage/manga/2019/07/c06.png'
    },
    {
      id: 7,
      img: 'https://project-manga.oo/storage/manga/2019/07/c07.png'
    },
    {
      id: 8,
      img: 'https://project-manga.oo/storage/manga/2019/07/c08.png'
    },
    {
      id: 9,
      img: 'https://project-manga.oo/storage/manga/2019/07/c10.png'
    },
    {
      id: 10,
      img: 'https://project-manga.oo/storage/manga/2019/07/c10.png'
    },
    {
      id: 11,
      img: 'https://project-manga.oo/storage/manga/2019/07/c11.png'
    },
    {
      id: 12,
      img: 'https://project-manga.oo/storage/manga/2019/07/c12.png'
    },
    {
      id: 13,
      img: 'https://project-manga.oo/storage/manga/2019/07/c13.png'
    },
    {
      id: 14,
      img: 'https://project-manga.oo/storage/manga/2019/07/c14.png'
    },
    {
      id: 15,
      img: 'https://project-manga.oo/storage/manga/2019/07/c15.png'
    },
    {
      id: 16,
      img: 'https://project-manga.oo/storage/manga/2019/07/c16.png'
    },
    {
      id: 17,
      img: 'https://project-manga.oo/storage/manga/2019/07/c17.png'
    },
    {
      id: 18,
      img: 'https://project-manga.oo/storage/manga/2019/07/c18.png'
    },
    {
      id: 19,
      img: 'https://project-manga.oo/storage/manga/2019/07/c19.png'
    },
    {
      id: 20,
      img: 'https://project-manga.oo/storage/manga/2019/07/c20.png'
    },
    {
      id: 21,
      img: 'https://project-manga.oo/storage/manga/2019/07/c21.png'
    }
  ];
  dataScroll: any = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller
  ) {
    this.renderer.addClass(this.document.body, 'reader-mode');
  }

  genCanvasID(id) {
    return 'data-dwi-' + id;
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.canvasInit();
    }, 1000);

/*     const content = this.document.getElementsByClassName('reader-mode');
    const scroll$ = fromEvent(content, 'scroll').pipe(map(() => content));

    scroll$.subscribe(element => {
      console.log(element);
      // do whatever
    }); */
  }

  getImgFromArray(id) {
    for (const data of this.sampleData) {
      if (data.id.toString() === id) {
        return data.img;
      }
    }
    return false;
  }

  canvasInit() {
    const test = Array.from(this.document.getElementsByClassName('dataMainCanvas'));
    test.forEach((element: any) => {
      const getID = element.getAttribute('id').replace('data-dwi-', '') || 0;
      const getCTX = element.getContext('2d') || null;
      const GetIMGData = this.getImgFromArray(getID);
      const tempImg = new Image();
      tempImg.onload = () => {
        element.width = tempImg.width;
        element.height = tempImg.height;
        getCTX.drawImage(tempImg, 0, 0);
        console.log(element);
      };
      tempImg.src = GetIMGData;
      element.oncontextmenu = (e) => e.preventDefault();
      // console.log(GetIMGData);
    });
    console.log(test);
  }

  ngOnInit() {
    // const getCanvasContainer = this.renderContainer.nativeElement;
    // console.log(this.sampleData.length);
    // console.log(getCanvasContainer.childNodes);
    // getCanvasContainer.childNodes.forEach( (element, index) => {
    //   console.log(getCanvasContainer.childNodes[index]);
    //   element.oncontextmenu = (e) => e.preventDefault();
    // });
    // window.addEventListener('scroll', this.scroll, true);
    // const element: any = this.document.getElementsByClassName('reader-mode');
    // this.document.addEventListener('scroll', e => {
    //   console.log(e);
    //   // console.log(e.srcElement.scrollLeft, e.srcElement.scrollTop);
    // });
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'reader-mode');
    // window.removeEventListener('scroll', this.scroll, true);
  }

  getCurrentOffsetTop(element: ElementRef) {
    const rect = element.nativeElement.getBoundingClientRect();
    return rect.top + window.pageYOffset - document.documentElement.clientTop;
  }

  getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    console.group( 'Scroll Report:' );
    const numberA = this.window.pageYOffset || 0;
    const numberB = this.document.documentElement.scrollTop || 0;
    const numberC = this.document.body.scrollTop || 0;
    console.log('Scroll Page:', numberA);
    console.log('Scroll Document:', numberB);
    console.log('Scroll Body:', numberC);
    // const test = Array.from(this.document.getElementsByClassName('dataMainCanvas'));
    // test.forEach((element: any) => {
    //   console.log(element.scrollTop);
    // });
    const getCanvas1: any = this.document.getElementById('data-dwi-1');
    console.log('Canvas Top:', getCanvas1.offsetTop);
    // const currentScrollPosition = this.viewportScroller.getScrollPosition();
    // console.log('Scroll Current Position:', currentScrollPosition);
    console.groupEnd();

    /* if (number > 100) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 10) {
      this.navIsFixed = false;
    } */
  }

}
