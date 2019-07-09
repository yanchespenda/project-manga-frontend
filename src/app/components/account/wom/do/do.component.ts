import { AuthService } from './../../../../services/auth/auth.service';
import { environment } from './../../../../../environments/environment';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, FormGroupDirective, NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { MatIconRegistry, ErrorStateMatcher } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

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
  @ViewChild('mceCarousel', {static: true}) mceCarousel: ElementRef;
  @ViewChild('mceCarouselItems', {static: true}) mceCarouselItems: ElementRef;
  @ViewChild('inputPass1', {static: true}) inputPass1: ElementRef;
  @ViewChild('inputPass2', {static: true}) inputPass2: ElementRef;
  webData = {
    name: environment.nameWeb
  };
  dataInit: any = {
    E: false,
    T: false,
    N: false,
    D: false
  };
  recaptchaSubscriber: Subscription;
  isLoading = false;
  doError = false;
  isErrorPrimary = false;
  pswdHide = true;
  matcher = new MyErrorStateMatcher();
  loginFormA = this.formBuilder.group({
    pass1: ['', [Validators.required]],
    pass2: ['']
  }, {validator: this.checkPasswords});

  initMSG: string;
  errorMSG: string;
  errorMSGA: string;
  errorMSGB: string;
  currentIndex: any;
  nextIndex: number;
  messageData = {
    txt: null
  };


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.pass1.value;
    const confirmPass = group.controls.pass2.value;

    return pass === confirmPass ? null : { childrenNotEqual: true };
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private recaptchaV3Service: ReCaptchaV3Service,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    iconRegistry.addSvgIcon('visibility',
      this.getImgResource('assets/icons-md/baseline-visibility-24px.svg'));
    iconRegistry.addSvgIcon('visibility_off',
      this.getImgResource('assets/icons-md/baseline-visibility_off-24px.svg'));
  }

  getImgResource(image: string) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
    return '';
  }

  stepper(idx: number) {
    this.currentIndex = this.nextIndex;
    this.nextIndex = idx;

    this.renderer2.setAttribute(this.mceCarousel.nativeElement, 'mce-carousel-selected', idx.toString());
    this.mce_carousel_update();
    // if (idx === this.dataPageIndex.default) {
    //   this.pswdHide = true;
    //   if (this.currentIndex === this.dataPageIndex.message || this.currentIndex === this.dataPageIndex.resetAccount) {
    //     this.loginFormA.reset();
    //   } else {
    //     this.valA.password.reset();
    //   }
    //   this.loginFormA.markAsPristine();
    //   this.loginFormA.markAsUntouched();
    // }
    setTimeout(() => {

      this.isLoading = false;
    }, 600);
  }

  goBack() {
    window.open('/', '_self');
  }

  recaptchaUnsubscribe() {
    if (this.recaptchaSubscriber) {
      this.recaptchaSubscriber.unsubscribe();
    }
  }

  getErrorMessagePass1() {
    if (this.valA.pass1.hasError('required')) {
      this.errorMSGA = 'Please input your new password';
    } else if (this.valA.pass1.hasError('minlength')) {
      this.errorMSGA = 'Password to short';
    }
    return this.errorMSGA;
  }

  getErrorMessagePass2() {
    if (this.valA.pass2.hasError('required')) {
      this.errorMSGB = 'Please input your new password again';
    } else if (this.valA.pass2.hasError('minlength')) {
      this.errorMSGB = 'Password to short';
    } else if (this.loginFormA.hasError('childrenNotEqual')) {
      this.errorMSGB = 'Password does not match';
    }
    return this.errorMSGB;
  }

  getErrorMessagePrimary() {
    return this.errorMSG;
  }

  getInitialText() {
    return this.initMSG;
  }

  initToken() {
    this.isErrorPrimary = false;
    this.initMSG = 'Initializing';
    this.recaptchaUnsubscribe();
    this.recaptchaSubscriber = this.recaptchaV3Service.execute('do_x1')
      .subscribe((token) => {
        this.initMSG = 'Validating Token';
        this.authService.do(this.dataInit.E, this.dataInit.T, this.dataInit.N, this.dataInit.D, token).pipe(
          catchError(val => of(val))
        ).subscribe(
          (jsonData) => {
            console.log(jsonData);
            if (jsonData.status) {
              if (jsonData.data.code === 1) {
                this.messageData.txt = jsonData.data.core.msg || null;
                this.stepper(2);
              } else if (jsonData.data.code === 2) {
                this.stepper(1);
              }
            } else {
              const getDataError = jsonData.data.code;
              if (getDataError.length !== undefined && getDataError.length > 0) {
                for (const row of getDataError) {
                  if (row === 10) {
                    this.initMSG = 'Param e required';
                  } else if (row === 11) {
                    this.initMSG = 'Param t required';
                  } else if (row === 12) {
                    this.initMSG = 'Param n required';
                  } else if (row === 13) {
                    this.initMSG = 'Param do required';
                  } else if (row === 3 || row === 90 || row === 0) {
                    this.initMSG = jsonData.message;
                  }
                  this.isErrorPrimary = true;
                }
              }
              this.isLoading = false;
            }
          },
          (err) => {
            this.isLoading = false;
            console.error(err);
          },
          () => {

          }
        );
      },
      (err) => {
        this.isErrorPrimary = true;
        console.error(err);
      },
      () => {

      });
  }

  SubmitA() {
    if (this.loginFormA.invalid) {
      if (this.valA.pass1.invalid) {
        this.inputPass1.nativeElement.focus();
      } else if (this.valA.pass2.invalid) {
        this.inputPass2.nativeElement.focus();
      }
      return;
    }

    console.log(this.loginFormA);
    this.isErrorPrimary = false;
    this.isLoading = true;
  }

  get valA() {
    return this.loginFormA.controls;
  }

  private mce_carousel_init() {
    const selectorIndex: number = this.mceCarousel.nativeElement.getAttribute('mce-carousel-selected') || 0;
    this.mceCarouselItems.nativeElement.childNodes.forEach( (element, index) => {
      const itemId = 'mce-carousel-id-' + index;
      this.renderer2.setAttribute(element, 'id', 'mce-carousel-id-' + index);
      if ( selectorIndex >= 0 && selectorIndex < this.mceCarouselItems.nativeElement.childNodes.length ) {
        let itsChanged = 0;
        if ( index < selectorIndex ) {
          itsChanged++;
          this.renderer2.addClass(element, 'mce-left');
        }
        if ( index > selectorIndex ) {
          itsChanged++;
          this.renderer2.addClass(element, 'mce-right');
        }
        if ( itsChanged === 0 ) {
          this.renderer2.addClass(element, 'mce-active');
        }
      }
    });
  }

  private mce_carousel_update() {
    let selectorIndex: number;
    selectorIndex = this.mceCarousel.nativeElement.getAttribute('mce-carousel-selected') || 0;
    this.mceCarouselItems.nativeElement.childNodes.forEach( (element, index) => {
      const itemId = element.getAttribute('id').replace('mce-carousel-id-', '');
      let itsChanged = 0;
      if ( itemId < selectorIndex ) {
        itsChanged++;
        this.renderer2.removeClass(element, 'mce-right');
        this.renderer2.removeClass(element, 'mce-active');
        this.renderer2.addClass(element, 'mce-left');
      }
      if ( itemId > selectorIndex ) {
        itsChanged++;
        this.renderer2.addClass(element, 'mce-right');
        this.renderer2.removeClass(element, 'mce-active');
        this.renderer2.removeClass(element, 'mce-left');
      }
      if ( itsChanged === 0 ) {
        this.renderer2.removeClass(element, 'mce-right');
        this.renderer2.addClass(element, 'mce-active');
        this.renderer2.removeClass(element, 'mce-left');
      }
    });
  }

  ngOnInit() {
    this.mce_carousel_init();
    const dataE = this.activatedRoute.snapshot.queryParams.e || false;
    const dataT = this.activatedRoute.snapshot.queryParams.t || false;
    const dataN = this.activatedRoute.snapshot.queryParams.n || false;
    const dataD = this.activatedRoute.snapshot.queryParams.do || false;

    this.dataInit.E = dataE;
    this.dataInit.T = dataT;
    this.dataInit.N = dataN;
    this.dataInit.D = dataD;

    if (!dataE && !dataT && !dataN && !dataD) {
      this.doError = true;
    }

    if (dataD < 1 || dataD > 2) {
      this.doError = true;
    }

    if (this.doError) {
      this.isErrorPrimary = true;
      this.errorMSG = 'Missing params';
      this.initMSG = this.errorMSG;
    } else {
      this.initToken();
    }

    console.group('Do Init:');
    console.log('dataE:', dataE);
    console.log('dataT:', dataT);
    console.log('dataN:', dataN);
    console.log('dataD:', dataD);
    console.groupEnd();
  }

}
