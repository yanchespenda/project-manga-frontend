import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, Input,
  ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, first, filter, catchError } from 'rxjs/operators';
import { throwError, of, Subscription } from 'rxjs';

import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';

import { MatSnackBar, MatIconRegistry } from '@angular/material';

import { Title, Meta, DomSanitizer } from '@angular/platform-browser';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'manga-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
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
export class SigninComponent implements OnInit {
  @ViewChild('mceCarousel', {static: true}) mceCarousel: ElementRef;
  @ViewChild('mceCarouselItems', {static: true}) mceCarouselItems: ElementRef;
  @ViewChild('inputUsername', {static: true}) inputUsername: ElementRef;
  @ViewChild('inputPassword', {static: true}) inputPassword: ElementRef;
  @ViewChild('inputGC', {static: true}) inputGC: ElementRef;
  @ViewChild('inputRC', {static: true}) inputRC: ElementRef;

  private singleExecutionSubscription: Subscription;

  isLoading = false;
  pswdHide = true;
  loginFormA: FormGroup = this.formBuilder.group({
    username: [
      '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    ],
    password: [
      '', [Validators.required, Validators.minLength(2)]
    ]
  });
  loginFormB: FormGroup = this.formBuilder.group({
    googleCode: [
      '', [Validators.required, Validators.pattern(/^([\d]{6}|[\d]{3}\s[\d]{3})$/)]
    ]
  });
  loginFormC: FormGroup = this.formBuilder.group({
    recoveryCode: [
      '', [Validators.required, Validators.pattern(/^([\d]{8}|[\d]{4}\s[\d]{4})$/)]
    ]
  });

  currentIndex = 0;
  nextIndex = 0;
  isErrorPrimary = false;
  errorMSG: string;
  errorMSGA: string;
  errorMSGB: string;
  errorMSGC: string;
  errorMSGD: string;
  temporaryData: any = {
    b2fa1: false,
    b2fa2: false,
    username: null,
    security: null
  };
  dataPageIndex = {
    default: 0,
    message: 5,
    googleCode: 1,
    recoveryCode: 2,
    resetConfirm: 4,
    resetAccount: 3
  };
  resetData = {
    useAccountBar: false,
    text: null,

  };
  messageData = {

  };

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    iconRegistry.addSvgIcon('visibility',
      this.getImgResource('assets/icons-md/baseline-visibility-24px.svg'));
    iconRegistry.addSvgIcon('visibility_off',
      this.getImgResource('assets/icons-md/baseline-visibility_off-24px.svg'));
    iconRegistry.addSvgIcon('perm_identity',
      this.getImgResource('assets/icons-md/baseline-perm_identity-24px.svg'));
    iconRegistry.addSvgIcon('keyboard_arrow_down',
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

  animationDone() {
    console.log('End');
  }

  stepper(idx: number) {
    this.currentIndex = this.nextIndex;
    this.nextIndex = idx;

    this.renderer2.setAttribute(this.mceCarousel.nativeElement, 'mce-carousel-selected', idx.toString());
    this.mce_carousel_update();
    if (idx === this.dataPageIndex.default) {
      this.pswdHide = false;
      if (this.currentIndex === 3) {
        this.loginFormA.reset();
      } else {
        this.valA.password.reset();

      }
      this.loginFormA.markAsPristine();
      this.loginFormA.markAsUntouched();
    } else if (idx === 1) {
      this.loginFormB.reset();
      this.loginFormB.markAsPristine();
      this.loginFormB.markAsUntouched();
    }
    setTimeout(() => {
      if (idx === 0) {
        if (this.currentIndex === 3) {
          this.inputUsername.nativeElement.focus();
        } else {
          this.inputPassword.nativeElement.focus();
        }
      } else if (idx === 1) {
        this.inputGC.nativeElement.focus();
      }
    }, 600);
  }

  goReset() {
    if (this.nextIndex === this.dataPageIndex.default) {
      this.resetData.text = 'Reset Password';
    }
    if (this.nextIndex === this.dataPageIndex.googleCode) {
      if (this.temporaryData.b2fa2) {
        this.stepper(this.dataPageIndex.recoveryCode);
      } else {
        this.stepper(this.dataPageIndex.resetAccount);
      }
    } else if (this.nextIndex === 2) {
      this.stepper(this.dataPageIndex.message);
    } else if (this.nextIndex === this.dataPageIndex.resetAccount) {
      this.stepper(this.dataPageIndex.default);
    } else {
      this.stepper(this.dataPageIndex.resetAccount);
    }
  }

  goBack() {
    if (this.nextIndex === 1) {
      this.stepper(this.currentIndex);
    } else if (this.nextIndex === this.dataPageIndex.message) {
      this.stepper(this.dataPageIndex.default);
    }
  }

  changeAccount() {
    this.stepper(this.dataPageIndex.default);
  }

  getErrorMessageUsername() {
    if (this.valA.username.hasError('required')) {
      this.errorMSGA = 'Please input your username or email';
    } else if (this.valA.username.hasError('minlength')) {
      this.errorMSGA = 'Username or email to short';
    }
    return this.errorMSGA;
  }

  getErrorMessagePassword() {
    if (this.valA.password.hasError('required')) {
      this.errorMSGB = 'Please input your password';
    } else if (this.valA.password.hasError('minlength')) {
      this.errorMSGB = 'Password to short';
    }
    return this.errorMSGB;
  }

  getErrorMessageGC() {
    if (this.valB.googleCode.hasError('required')) {
      this.errorMSGC = 'Please input your google auth key';
    } else if (this.valB.googleCode.hasError('pattern')) {
      this.errorMSGC = 'Key not valid';
    }
    return this.errorMSGC;
  }

  getErrorMessageRC() {
    if (this.valC.recoveryCode.hasError('required')) {
      this.errorMSGD = 'Please input your recovery code';
    } else if (this.valC.recoveryCode.hasError('pattern')) {
      this.errorMSGD = 'Code not valid';
    }
    return this.errorMSGD;
  }

  getErrorMessagePrimary() {
    return this.errorMSG;
  }

  SubmitB() {
    // console.log(Validators);
    console.log(this.loginFormB);
  }

  SubmitC() {

  }

  SubmitA() {
    if (this.loginFormA.invalid) {
      if (this.valA.username.invalid) {
        this.inputUsername.nativeElement.focus();
      } else if (this.valA.password.invalid) {
        this.inputPassword.nativeElement.focus();
      }
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;

    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.recaptchaV3Service.execute('login_a1')
      .subscribe((token) => {
        this.authService.login_1(this.valA.username.value, this.valA.password.value, token).pipe(
          catchError(val => of(val))
        ).subscribe(
          (jsonData) => {
            console.log(jsonData);
            if (jsonData.status) {
              // console.log('Working status true');
              if (jsonData.data.code === 1) {
                // console.log('Working code 1');
              } else if (jsonData.data.code === 2) {
                this.temporaryData = jsonData.data.core;
                // console.log('Working code 2');
                if (jsonData.data.core.b2fa1 !== undefined && jsonData.data.core.b2fa1) {
                  this.stepper(1);
                }
              }
            } else {
              const getDataError = jsonData.data.code;
              if (getDataError.length !== undefined && getDataError.length > 0) {
                // console.log('Working loop');
                for (let index = 0; index < getDataError.length; index++) {
                  console.log(getDataError[index]);
                  if (getDataError[index] === 10) {
                    this.errorMSGA = 'Username or Email required';
                    this.valA.username.setErrors({required: true});
                  } else if (getDataError[index] === 11) {
                    this.errorMSGA = 'Username or Email to short';
                    this.valA.username.setErrors({minlength: true});
                  } else if (getDataError[index] === 12) {
                    this.errorMSGA = 'Username or Email to long';
                    this.valA.username.setErrors({maxlength: true});
                  } else if (getDataError[index] === 13) {
                    this.errorMSGA = jsonData.message;
                    this.valA.username.setErrors({available: true});
                  } else if (getDataError[index] === 20) {
                    this.errorMSGB = 'Password required';
                    this.valA.password.setErrors({required: true});
                  } else if (getDataError[index] === 21) {
                    this.errorMSGB = 'Password to short';
                    this.valA.password.setErrors({minlength: true});
                  } else if (getDataError[index] === 22) {
                    this.errorMSGB = 'Password to long';
                    this.valA.password.setErrors({maxlength: true});
                  } else if (getDataError[index] === 23) {
                    this.errorMSGB = jsonData.message;
                    this.valA.password.setErrors({wrong: true});
                  } else if (getDataError[index] === 3) {
                    this.errorMSG = jsonData.message;
                    this.isErrorPrimary = true;
                  }
    
                  if (getDataError[index] >= 0 && getDataError[index] < 20) {
                    this.inputUsername.nativeElement.focus();
                  } else if (getDataError[index] >= 20 && getDataError[index] < 30) {
                    this.inputPassword.nativeElement.focus();
                  }
                }
              }
            }
            // console.log(this.loginFormA);
          },
          (err) => {
            this.isLoading = false;
            // this.isErrorCards.b = true;
            console.error(err);
          },
          () => {
            this.isLoading = false;
            // console.log('observable complete');
            // this.isLoadCards.b = false;
          }
        );
      });

    
    // console.log("1 isUnsubscribed", observer.unsubscribe());
    // this.authService.login_1(this.valA.username.value, this.valA.password.value)
      // .pipe(first())
      // .subscribe(
        // data => {
          // console.log(data.status);
          // if (data.status) {

          // }
          // const dataReturn = data.data;
          // if (dataReturn.status === 99 || (dataReturn.result.code !== undefined && dataReturn.result.code === 99)) {
            // this.snackBar.open(dataReturn.message, '', {
            //   duration: 5000,
            // });
            // this.is_loading = false;
            // this.is_disabled_error = true;
            // this.loginFormA.get('username').disable();
          // } else {
            // let is_error = true;
            /*
              @ERROR CODE
                0. SOMETHING WENT WRONG
                1. SUCCESS
                2. USENAME NOT FOUND
                3. USERNAME WAS ATTEMP LOGIN
                4. USERNAME WAS BANNED
                5. USERNAME NOT ACTIVE
                6. USERNAME REQUIRED
                99. SECURITY FAILS
            */
            // if (dataReturn.result.code === 1) {
            //   this.configCSRF['skl'] = dataReturn.result.sk;
            //   this.temp_User.rrc = dataReturn.result.rrc;
            //   this.temp_User['username'] = dataReturn.result.username;
            //   this.temp_User['td_stg'] = dataReturn.result.td_stg;
            //   this.goTo(1);
            //   is_error = false;
            // } else if (dataReturn.result.code === 2) {
            //   console.log(dataReturn.result.code);
            //   this.loginFormA.get('username').setErrors({available: true});
            // } else if (dataReturn.result.code === 3) {
            //   console.log(dataReturn.result.code);
            //   this.loginFormA.get('username').setErrors({fails: true});
            // } else if (dataReturn.result.code === 4) {
            //   console.log(dataReturn.result.code);
            //   this.loginFormA.get('username').setErrors({ban: true});
            // } else if (dataReturn.result.code === 5) {
            //   console.log(dataReturn.result.code);
            //   this.loginFormA.get('username').setErrors({notactive: true});
            // } else if (dataReturn.result.code === 6) {
            //   console.log(dataReturn.result.code);
            //   this.loginFormA.get('username').setErrors({required: true});
            // }
            // if (dataReturn.result.csrf !== undefined) {
              // this.configCSRF['data'] = dataReturn.result.csrf;
            // }
            // if (is_error) {
              // this.inpt_username.nativeElement.focus();
              // this.is_loading = false;
            // }
          // }
          // this.isLoading = false;
        // },
        // error => {
          // this.isLoading = false;
          // console.log(error);
          // this.snackBar.open('Something went wrong, try again', '', {
            // duration: 5000,
          // });
        // });
  }

  get valA() {
    return this.loginFormA.controls;
  }

  get valB() {
    return this.loginFormB.controls;
  }

  get valC() {
    return this.loginFormC.controls;
  }

  ngOnInit() {
    this.mce_carousel_init();

    this.inputUsername.nativeElement.focus();
    // this.loginFormA = this.formBuilder.group({
    //   username: [
    //     '', [Validators.required]
    //   ],
    //   password: [
    //     '', [Validators.required]
    //   ]
    // });
  }

}
