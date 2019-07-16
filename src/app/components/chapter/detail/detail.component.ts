import { environment } from './../../../../environments/environment';
import { WINDOW } from './../../../services/window/window.service';
import { Component, OnInit, OnDestroy, Renderer2, Inject,
  Input, ElementRef, AfterViewInit, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import { DOCUMENT, ViewportScroller,  } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise, map } from 'rxjs/operators';

import { DetailService } from './detail.service';

@Component({
  selector: 'manga-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('renderContainer', { static: true }) renderContainer: ElementRef;
  @ViewChildren('canvasParent') renderContainers !: QueryList<ElementRef>;
  sampleData: any = [
    {
      id: 1,
      img: environment.base_api_url + 'storage/manga/2019/07/c01.png'
    },
    {
      id: 2,
      img: environment.base_api_url + 'storage/manga/2019/07/c02.png'
    },
    {
      id: 3,
      img: environment.base_api_url + 'storage/manga/2019/07/c03.png'
    },
    {
      id: 4,
      img: environment.base_api_url + 'storage/manga/2019/07/c04.png'
    },
    {
      id: 5,
      img: environment.base_api_url + 'storage/manga/2019/07/c05.png'
    },
    {
      id: 6,
      img: environment.base_api_url + 'storage/manga/2019/07/c06.png'
    },
    {
      id: 7,
      img: environment.base_api_url + 'storage/manga/2019/07/c07.png'
    },
    {
      id: 8,
      img: environment.base_api_url + 'storage/manga/2019/07/c08.png'
    },
    {
      id: 9,
      img: environment.base_api_url + 'storage/manga/2019/07/c09.png'
    },
    {
      id: 10,
      img: environment.base_api_url + 'storage/manga/2019/07/c10.png'
    },
    {
      id: 11,
      img: environment.base_api_url + 'storage/manga/2019/07/c11.png'
    },
    {
      id: 12,
      img: environment.base_api_url + 'storage/manga/2019/07/c12.png'
    },
    {
      id: 13,
      img: environment.base_api_url + 'storage/manga/2019/07/c13.png'
    },
    {
      id: 14,
      img: environment.base_api_url + 'storage/manga/2019/07/c14.png'
    },
    {
      id: 15,
      img: environment.base_api_url + 'storage/manga/2019/07/c15.png'
    },
    {
      id: 16,
      img: environment.base_api_url + 'storage/manga/2019/07/c16.png'
    },
    {
      id: 17,
      img: environment.base_api_url + 'storage/manga/2019/07/c17.png'
    },
    {
      id: 18,
      img: environment.base_api_url + 'storage/manga/2019/07/c18.png'
    },
    {
      id: 19,
      img: environment.base_api_url + 'storage/manga/2019/07/c19.png'
    },
    {
      id: 20,
      img: environment.base_api_url + 'storage/manga/2019/07/c20.png'
    },
    {
      id: 21,
      img: environment.base_api_url + 'storage/manga/2019/07/c21.png'
    }
  ];
  dataScroll: any = [];
  getLastIndex = 0;
  canvasDataList: any = [];
  currentInterval = 5;
  curentActive = 0;
  curentOnScroll = 0;

  CURRENT_MID: any = 0;
  CURRENT_CID: any = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    private titleTab: Title,
    private detailService: DetailService,
    private activatedRoute: ActivatedRoute
  ) {
    this.renderer2.addClass(this.document.body, 'reader-mode');
    this.currentInterval = environment.setIntervalOnLoad;
  }

  setTabTitle(title: string) {
    this.titleTab.setTitle(title);
  }

  genCanvasID(id) {
    return 'data-dwi-' + id;
  }

  genCanvasParentID(id) {
    return 'data-dwi-parent-' + id;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setCanvasList();
      this.canvasInit();
    }, 1000);
  }

  getImgFromArray(id) {
    for (const data of this.sampleData) {
      if (data.id.toString() === id) {
        return data.img;
      }
    }
    return false;
  }

  setCanvasList() {
    this.canvasDataList = Array.from(this.document.getElementsByClassName('dataMainCanvas'));
  }

  // dataScroll
  canvasInit() {
    this.curentActive = this.currentInterval;
    let indexCounter = 0;
    this.canvasDataList.forEach((element: any) => {
      if (indexCounter <= this.curentActive) {
        this.renderer2.setAttribute(element, 'data-status', '1');
        const getID = element.getAttribute('id').replace('data-dwi-', '') || 0;
        const getCTX = element.getContext('2d') || null;
        const GetIMGData = this.getImgFromArray(getID);
        const tempImg = new Image();
        tempImg.onload = () => {
          element.width = tempImg.width;
          element.height = tempImg.height;
          getCTX.drawImage(tempImg, 0, 0);
        };
        tempImg.src = GetIMGData;
        indexCounter++;
      }
      element.oncontextmenu = (e) => e.preventDefault();
    });

    setTimeout(() => {
      this.dataCanvasScroll();
    }, 500);
    // this.renderContainers.changes.subscribe((r) => this.dataCanvasScroll());
    console.log(this.renderContainers);
  }

  dataCanvasScroll() {
    this.renderContainers.map((element: any, idx) => {
      const getCanvasScrollTop = element.nativeElement.offsetTop;
      if (this.dataScroll.length !== this.sampleData.length) {
        this.dataScroll.push({state: 0, top: getCanvasScrollTop});
      } else {
        if (this.dataScroll[idx].top !== undefined) {
          this.dataScroll[idx].top = getCanvasScrollTop;
        }
      }
    });
  }

  loadInit() {
    // this.detailService.initChapter();
  }

  ngOnInit() {
    this.CURRENT_CID = this.activatedRoute.snapshot.paramMap.get('id');
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
    this.renderer2.removeClass(this.document.body, 'reader-mode');
  }

  changeStateCanvas(idx, to) {
    this.canvasDataList.forEach((element: any, eidx) => {
      if (idx === eidx) {
        this.renderer2.setAttribute(element, 'data-status', to);
        if (to === 1) {
          const getID = element.getAttribute('id').replace('data-dwi-', '') || 0;
          const getCTX = element.getContext('2d') || null;
          const GetIMGData = this.getImgFromArray(getID);
          const tempImg = new Image();
          tempImg.onload = () => {
            element.width = tempImg.width;
            element.height = tempImg.height;
            getCTX.drawImage(tempImg, 0, 0);
          };
          tempImg.src = GetIMGData;
          this.curentActive++;
          this.dataCanvasScroll();
        }
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // console.group( 'Scroll Report:' );
    const numberA = this.window.pageYOffset;
    const numberB = this.document.documentElement.scrollTop;
    const numberC = this.document.body.scrollTop;

    this.dataScroll.forEach((element, idx) => {
      if (numberB > element.top && element.state === 0) {
        element.state = 2;
        if (this.getLastIndex !== idx) {
          this.dataScroll[this.getLastIndex].state = 3;
          this.changeStateCanvas(this.getLastIndex, this.dataScroll[this.getLastIndex].state);
        }
        this.getLastIndex = idx;
        if (element.state === 2) {
          this.curentOnScroll++;
          this.changeStateCanvas(idx, element.state);

          if ((this.curentActive - this.curentOnScroll) < this.currentInterval ) {
            const futureIndex = this.curentActive - 1;
            /* console.group( 'Scroll Report:' );
            console.log('Curent Active: ', this.curentActive);
            console.log('Curent On Scroll: ', this.curentOnScroll);
            console.log('Curent Interval: ', this.currentInterval);
            console.log('Run Load Canvas To: ', futureIndex);
            console.groupEnd(); */
            this.changeStateCanvas(futureIndex, 1);
          }
        }
      }
    });
    // console.log(this.dataScroll);
    // console.log('Scroll Page:', numberA);
    // console.log('Scroll Document:', numberB);
    // console.log('Scroll Body:', numberC);
    // console.log('Document Data:', this.document.documentElement);
    // console.log('Scroll Body:', this.document.documentElement.height);
    // const test = Array.from(this.document.getElementsByClassName('dataMainCanvas'));
    // test.forEach((element: any) => {
    //   console.log(element.scrollTop);
    // });
    // const getCanvas1: any = this.document.getElementById('data-dwi-parent-1');
    // console.log('Canvas Top:', getCanvas1.scrollTop);
    // const currentScrollPosition = this.viewportScroller.getScrollPosition();
    // console.log('Scroll Current Position:', currentScrollPosition);
    // console.groupEnd();

    // this.setTabTitle('P: ' + numberA + ' | C: ' + this.curentOnScroll);

    /* if (number > 100) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 10) {
      this.navIsFixed = false;
    } */
  }

}
