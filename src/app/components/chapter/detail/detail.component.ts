import { ChapterReportDialogComponent } from './../../main/dialog/dialog.report';
import { environment } from './../../../../environments/environment';
import { WINDOW } from './../../../services/window/window.service';
import { Component, OnInit, OnDestroy, Renderer2, Inject,
  Input, ElementRef, AfterViewInit, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Title, DomSanitizer, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, of } from 'rxjs';
import { switchMap, takeUntil, pairwise, map, catchError } from 'rxjs/operators';

import { DetailService } from './detail.service';
import { MatIconRegistry, MatDialog } from '@angular/material';

@Component({
  selector: 'manga-chapter-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('renderContainer', { static: true }) renderContainer: ElementRef;
  @ViewChildren('canvasParent') renderContainers !: QueryList<ElementRef>;
  chapterData: any = [];
  dataScroll: any = [];
  getLastIndex = 0;
  canvasDataList: any = [];
  currentInterval = 5;
  curentActive = 0;
  curentOnScroll = 0;
  CURRENT_MID: any = 0;
  CURRENT_CID: any = 0;
  isLoading = false;
  chapterSelect: any = [];
  chapterSelected: any = 0;
  chapterNext: any = {
    enabled: false,
    link: null,
    id: 0
  };
  chapterPrev: any = {
    enabled: false,
    link: null,
    id: 0
  };
  canvasLoader: any;
  dialogData: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    private titleTab: Title,
    private detailService: DetailService,
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    public matDialog: MatDialog,
    private meta: Meta
  ) {
    this.renderer2.addClass(this.document.body, 'reader-mode');
    this.currentInterval = environment.setIntervalOnLoad;
    this.iconInit();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(ChapterReportDialogComponent, {
      width: '450px',
      data: {
        issueRequest: 2,
        dialogData: this.dialogData,
        issueID: this.CURRENT_CID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // this.messageData.txt = result;
      if (result === null) {
        this.openDialog();
      } else if (result === false) {
        // this.temporaryData.username = result;
        // this.SubmitE();
      }

    });
  }

  iconInit() {
    this.iconRegistry.addSvgIcon('flag',
      this.getImgResource('assets/icons-md/baseline-flag-24px.svg'));
  }

  getImgResource(image: string) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
    return '';
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
    // setTimeout(() => {
    //   this.setCanvasList();
    //   this.canvasInit();
    // }, 1000);
  }

  getImgFromArray(id) {
    for (const data of this.chapterData) {
      if (data.id.toString() === id.toString()) {
        return data.img;
      }
    }
    return false;
  }

  getRouteFromArray(id) {
    for (const data of this.chapterSelect) {
      if (data.id.toString() === id.toString()) {
        return data.link;
      }
    }
    return '/';
  }

  getNameFromArray(id) {
    for (const data of this.chapterSelect) {
      if (data.id.toString() === id.toString()) {
        return data.text;
      }
    }
    return '/';
  }

  setCanvasList() {
    this.canvasDataList = Array.from(this.document.getElementsByClassName('dataMainCanvas'));
  }

  canvasInit() {
    this.setCanvasList();
    this.curentActive = this.currentInterval;
    let indexCounter = 0;
    this.canvasDataList.forEach((element: any) => {
      // this.canvasLoader.push();
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
      if (this.dataScroll.length !== this.chapterData.length) {
        this.dataScroll.push({state: 0, top: getCanvasScrollTop});
      } else {
        if (this.dataScroll[idx].top !== undefined) {
          this.dataScroll[idx].top = getCanvasScrollTop;
        }
      }
    });
  }

  chapterSelectorChange(evn) {
    // console.log(evn);
    // console.log(this.chapterSelect);
    const getRoute = this.getRouteFromArray(evn);
    // console.log(getRoute);
    this.router.navigate([ getRoute ]);
    this.CURRENT_CID = evn;
    this.loadInit();
  }

  chapterNav(id) {
    if (id) {
      this.CURRENT_CID = id;
      this.loadInit();
    }
  }

  async loadInit() {
    this.chapterData = [];
    this.isLoading = true;
    this.detailService.initChapter(this.CURRENT_CID)
      .pipe(
        catchError(val => of(val))
      ).subscribe(
        (jsonData) => {
          // console.log(jsonData);
          if (jsonData.error !== undefined) {
            // this.isErrorCards.x = true;
            if (jsonData.error === 404) {
              // this.isNotFound = true;
              this.setTabTitle(jsonData.message);
            }
          } else {
            if (jsonData.status !== undefined && jsonData.status) {
              const chapterData = jsonData.data;
              // this.isDone = true;
              this.setTabTitle(chapterData.manga_info.title);
              this.chapterData = chapterData.list;
              this.chapterSelect = chapterData.chapter;
              this.chapterNext = chapterData.chapter_next;
              this.chapterPrev = chapterData.chapter_prev;

              this.meta.addTags([
                { name: 'twitter:card', content: 'summary' },
                { name: 'og:url', content: this.window.location.href },
                { name: 'og:title', content: chapterData.meta.title },
                { name: 'og:description', content: chapterData.meta.description },
                { name: 'og:type', content: chapterData.meta.type },
                { name: 'og:image', content: chapterData.meta.image },
                { name: 'description', content: chapterData.meta.description },
              ]);

              setTimeout(() => {
                this.chapterSelected = chapterData.chapter_selected;
                this.dialogData = this.getNameFromArray(this.chapterSelected);
                // this.chapterSelected = 10;
                this.canvasInit();
              }, 100);
              // console.log(this.chapterData);
            } else {
              // this.isErrorCards.x = true;
            }
          }
        },
        (err) => {
          // this.isErrorCards.x = true;
          console.error(err);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  ngOnInit() {
    this.CURRENT_CID = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadInit();
    // const getCanvasContainer = this.renderContainer.nativeElement;
    // console.log(this.chapterData.length);
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
            this.dataCanvasScroll();
          };
          tempImg.src = GetIMGData;
          this.curentActive++;
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
