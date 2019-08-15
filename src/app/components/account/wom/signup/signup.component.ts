import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, mergeMap, finalize } from 'rxjs/operators';
import { of, Subscription, throwError, from } from 'rxjs';

import { OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'manga-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('mceCarousel', {static: true}) mceCarousel: ElementRef;
  @ViewChild('mceCarouselItems', {static: true}) mceCarouselItems: ElementRef;
  @ViewChild('inputName1', {static: true}) inputName1: ElementRef;
  @ViewChild('inputName2', {static: true}) inputName2: ElementRef;
  @ViewChild('inputUsername', {static: true}) inputUsername: ElementRef;
  @ViewChild('inputEmail', {static: true}) inputEmail: ElementRef;
  @ViewChild('inputPassword1', {static: true}) inputPassword1: ElementRef;
  @ViewChild('inputPassword2', {static: true}) inputPassword2: ElementRef;

  isLoading = false;
  webData = {
    name: environment.nameWeb
  };
  pswdHide = true;
  regFormA: FormGroup = this.formBuilder.group({
    name1: [
      '', [Validators.required]
    ],
    name2: [
      '', []
    ],
    username: [
      '', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
    ],
    email: [
      '', [Validators.required, Validators.email]
    ],
    password1: [
      '', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]
    ],
    password2: [
      '', [Validators.required]
    ]
  });
  errorMSG: string;
  errorMSGA = {
    a: '',
    b: '',
    c: '',
    d: '',
    e: '',
    f: ''
  };
  dataPageIndex = {
    default: 0,
    term: 1,
    message: 2,
  };
  strenghtMSG: string;
  strenghtPoint: number;
  recentToken: any;
  recaptchaSubscription: Subscription;
  currentIndex: number;
  nextIndex: number;
  termData: any;
  isErrorPrimary = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private renderer2: Renderer2,
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService,
    private http: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    this.renderer2.addClass(this.document.body, 'oauth-mode');
    this.iconSetup();
  }

  iconSetup() {
    this.iconRegistry.addSvgIcon('visibility',
      this.getImgResource('assets/icons-md/baseline-visibility-24px.svg'));
    this.iconRegistry.addSvgIcon('visibility_off',
      this.getImgResource('assets/icons-md/baseline-visibility_off-24px.svg'));
    this.iconRegistry.addSvgIcon('perm_identity',
      this.getImgResource('assets/icons-md/baseline-perm_identity-24px.svg'));
    this.iconRegistry.addSvgIcon('keyboard_arrow_down',
      this.getImgResource('assets/icons-md/baseline-keyboard_arrow_down-24px.svg'));
  }

  getImgResource(image: string) {
    if (image) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(image);
    }
    return '';
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

  stepper(idx: number) {
    // console.log(idx);
    this.currentIndex = this.nextIndex;
    this.nextIndex = idx;

    this.renderer2.setAttribute(this.mceCarousel.nativeElement, 'mce-carousel-selected', idx.toString());
    this.mce_carousel_update();
    if (idx === this.dataPageIndex.default) {
    //   this.pswdHide = true;
    //   if (this.currentIndex === this.dataPageIndex.message || this.currentIndex === this.dataPageIndex.resetAccount) {
    //     this.loginFormA.reset();
    //   } else {
    //     this.valA.password.reset();
    //   }
    //   this.loginFormA.markAsPristine();
    //   this.loginFormA.markAsUntouched();
    } else if (idx === this.dataPageIndex.term) {

    }
    setTimeout(() => {
      if (idx === this.dataPageIndex.default) {
        // this.inputEmailConfirm.nativeElement.focus();
      }
      this.isLoading = false;
    }, 600);
  }

  getErrorMessageUsername() {
    if (this.valA.username.hasError('required')) {
      this.errorMSGA.a = 'Please input username';
    } else if (this.valA.username.hasError('minlength')) {
      this.errorMSGA.a = 'Username to short';
    } else if (this.valA.username.hasError('maxlength')) {
      this.errorMSGA.a = 'Username to long';
    } else if (this.valA.username.hasError('taken')) {
      this.errorMSGA.a = 'Username is taken';
    }
    return this.errorMSGA.a;
  }

  getErrorMessageEmail() {
    if (this.valA.email.hasError('required')) {
      this.errorMSGA.b = 'Please input email';
    } else if (this.valA.email.hasError('email')) {
      this.errorMSGA.b = 'Email does not valid';
    } else if (this.valA.email.hasError('maxlength')) {
      this.errorMSGA.b = 'Email to long';
    } else if (this.valA.email.hasError('taken')) {
      this.errorMSGA.b = 'Email is taken';
    }
    return this.errorMSGA.b;
  }

  getErrorMessagePassword1() {
    if (this.valA.password1.hasError('required')) {
      this.errorMSGA.c = 'Please input password';
    } else if (this.valA.password1.hasError('minlength')) {
      this.errorMSGA.c = 'Password to short';
    } else if (this.valA.password1.hasError('maxlength')) {
      this.errorMSGA.c = 'Password to long';
    }
    return this.errorMSGA.c;
  }

  getErrorMessagePassword2() {
    if (this.valA.password2.hasError('required')) {
      this.errorMSGA.d = 'Please input password';
    } else if (this.valA.password2.hasError('minlength')) {
      this.errorMSGA.d = 'Password to short';
    } else if (this.valA.password2.hasError('maxlength')) {
      this.errorMSGA.d = 'Password to long';
    } else if (this.valA.password2.hasError('notmatch')) {
      this.errorMSGA.d = 'Password does not match';
    }
    return this.errorMSGA.d;
  }

  getErrorMessageName1() {
    if (this.valA.name1.hasError('required')) {
      this.errorMSGA.e = 'Please input your first name';
    } else if (this.valA.name1.hasError('minlength')) {
      this.errorMSGA.e = 'First name to short';
    } else if (this.valA.name1.hasError('maxlength')) {
      this.errorMSGA.e = 'First name to long';
    }
    return this.errorMSGA.e;
  }

  getErrorMessageName2() {
    if (this.valA.name2.hasError('required')) {
      this.errorMSGA.f = 'Please input your last name';
    } else if (this.valA.name2.hasError('minlength')) {
      this.errorMSGA.f = 'Last name to short';
    } else if (this.valA.name2.hasError('maxlength')) {
      this.errorMSGA.f = 'Last name to long';
    }
    return this.errorMSGA.f;
  }

  getErrorMessagePrimary() {
    return this.errorMSG;
  }

  getStrenghtMessage() {
    return this.strenghtMSG;
  }

  validateStrength(input: string) {
    let counter = 0;
    if (/[a-z]/.test(input)) {
        counter++;
    }
    if (/[A-Z]/.test(input)) {
        counter++;
    }
    if (/[0-9]/.test(input)) {
        counter++;
    }
    if (/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(input)) {
        counter++;
    }
    return counter;
  }

  onPassStr(event: any) {
    this.strenghtPoint = this.validateStrength(event.target.value);
    if (this.strenghtPoint === 2) {
      this.strenghtMSG = 'Moderete';
    } else if (this.strenghtPoint === 3) {
      this.strenghtMSG = 'Strong';
    } else {
      this.strenghtMSG = 'Weak';
    }
  }

  onSamePassValue(event: any) {
    const curentPass1 = this.valA.password1.value || null;
    const curentPass2 = event.target.value || '';
    if (curentPass1 !== null && curentPass1 !== curentPass2) {
      this.valA.password2.setErrors({notmatch: true});
    }
  }

  get valA() {
    return this.regFormA.controls;
  }

  SubmitA() {
    if (this.regFormA.invalid) {
      if (this.valA.name1.invalid) {
        this.inputName1.nativeElement.focus();
      } else if (this.valA.name2.invalid) {
        this.inputName2.nativeElement.focus();
      } else if (this.valA.username.invalid) {
        this.inputUsername.nativeElement.focus();
      } else if (this.valA.email.invalid) {
        this.inputEmail.nativeElement.focus();
      } else if (this.valA.password1.invalid) {
        this.inputPassword1.nativeElement.focus();
      } else if (this.valA.password2.invalid) {
        this.inputPassword2.nativeElement.focus();
      }
      return;
    }
    if (this.isLoading) {
      return;
    }
    this.isErrorPrimary = false;

    const token = '1';
    // this.recaptchaUnsubscribe();
    // this.recaptchaSubscription = this.recaptchaV3Service.execute('registera')
      // .subscribe(
        // (token) => {
          // tslint:disable-next-line: align
          this.isLoading = true;

          // tslint:disable-next-line: align
          this.authService.registerA(
            this.valA.name1.value,
            this.valA.name2.value,
            this.valA.username.value,
            this.valA.email.value,
            this.valA.password1.value,
            this.valA.password2.value,
            token
          ).pipe(
            catchError(err => of(err))
          ).subscribe(
            (jsonData) => {
              // console.log(jsonData);
              if (jsonData.status) {
                if (jsonData.data.code === 1) {
                  const getCore = jsonData.data.core;
                  this.recentToken = getCore.token;
                  this.loadTerm(getCore.term);
                  // this.loadTerm('https://res.cloudinary.com/dslncjjz1/raw/upload/v1565858504/storage/json/terms-conditions.json');
                  // this.matSnackBar.open('Loggin in...', 'close', {
                  //   duration: 3000
                  // });
                  this.stepper(1);
                } else if (jsonData.data.code === 2) {

                }
              } else {
                const getDataError = jsonData.data.code;
                if (getDataError.length !== undefined && getDataError.length > 0) {
                  for (const row of getDataError) {
                    if (row === 10) {
                      this.valA.name1.setErrors({required: true});
                    } else if (row === 11) {
                      this.valA.name1.setErrors({maxlength: true});
                    } else if (row === 12) {
                      this.valA.name1.setErrors({minlength: true});
                    } else if (row === 20) {
                      this.valA.name2.setErrors({required: true});
                    } else if (row === 21) {
                      this.valA.name2.setErrors({maxlength: true});
                    } else if (row === 22) {
                      this.valA.name2.setErrors({minlength: true});
                    } else if (row === 30) {
                      this.valA.username.setErrors({required: true});
                    } else if (row === 31) {
                      this.valA.username.setErrors({maxlength: true});
                    } else if (row === 32) {
                      this.valA.username.setErrors({minlength: true});
                    } else if (row === 33) {
                      this.valA.username.setErrors({taken: true});
                    } else if (row === 40) {
                      this.valA.email.setErrors({required: true});
                    } else if (row === 41) {
                      this.valA.email.setErrors({email: true});
                    } else if (row === 42) {
                      this.valA.email.setErrors({maxlength: true});
                    } else if (row === 43) {
                      this.valA.email.setErrors({taken: true});
                    } else if (row === 50) {
                      this.valA.password1.setErrors({required: true});
                    } else if (row === 51) {
                      this.valA.password1.setErrors({maxlength: true});
                    } else if (row === 52) {
                      this.valA.password1.setErrors({minlength: true});
                    } else if (row === 60) {
                      this.valA.password2.setErrors({required: true});
                    } else if (row === 61) {
                      this.valA.password2.setErrors({maxlength: true});
                    } else if (row === 62) {
                      this.valA.password2.setErrors({minlength: true});
                    } else if (row === 63) {
                      this.valA.password2.setErrors({notmatch: true});
                    } else if (row === 3 || row === 90) {
                      this.errorMSG = jsonData.message;
                      this.isErrorPrimary = true;
                    }

                    if (row >= 0 && row < 20) {
                      this.inputName1.nativeElement.focus();
                    } else if (row >= 20 && row < 30) {
                      this.inputName2.nativeElement.focus();
                    } else if (row >= 30 && row < 40) {
                      this.inputUsername.nativeElement.focus();
                    } else if (row >= 40 && row < 50) {
                      this.inputEmail.nativeElement.focus();
                    } else if (row >= 50 && row < 60) {
                      this.inputPassword1.nativeElement.focus();
                    } else if (row >= 60 && row < 70) {
                      this.inputPassword2.nativeElement.focus();
                    }
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
              // this.isLoading = false;
              // console.log('observable complete');
              // this.isLoadCards.b = false;
            }
          );
        // }
      // );
  }

  SubmitB() {

  }

  loadTerm(urlTerm) {
    this.http.get(urlTerm).subscribe(
      (data: any) => {
        this.termData = data.content;
        // this.arrBirds = data as string [];	 // FILL THE ARRAY WITH DATA.
        //  console.log(this.arrBirds[1]);
      },
      (err) => {
        console.log(err);
      },
      () => console.log('Term completed.')
    );
  }

  goBack() {
    this.stepper(0);
  }

  recaptchaUnsubscribe() {
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.mce_carousel_init();
    setTimeout(() => {
      this.inputName1.nativeElement.focus();
    }, 100);
  }

  ngOnDestroy() {
    this.recaptchaUnsubscribe();
    this.renderer2.removeClass(this.document.body, 'oauth-mode');
  }

}
