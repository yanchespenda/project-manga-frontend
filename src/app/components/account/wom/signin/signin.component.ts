import { environment } from './../../../../../environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit,
  ViewChild, ElementRef, Renderer2, OnDestroy, Inject } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export interface DialogData {
  dialogEmail: string;
}

@Component({
  selector: 'manga-signin-dialog',
  templateUrl: './signin.dialog.email.html',
})
export class SigninDialogComponent {
  loginFormDialogA: FormGroup = this.formBuilder.group({
    email: [
      '', [Validators.required, Validators.email]
    ]
  });

  constructor(
    public dialogRef: MatDialogRef<SigninDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }

  getErrorMessage() {
    if (this.loginFormDialogA.controls.email.hasError('required')) {
      return 'Please input your email';
    } else if (this.loginFormDialogA.controls.email.hasError('email')) {
      return 'Email not valid';
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(this.loginFormDialogA.controls.email.value);
  }

}

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
export class SigninComponent implements OnInit, OnDestroy {
  @ViewChild('mceCarousel', {static: true}) mceCarousel: ElementRef;
  @ViewChild('mceCarouselItems', {static: true}) mceCarouselItems: ElementRef;
  @ViewChild('inputUsername', {static: true}) inputUsername: ElementRef;
  @ViewChild('inputPassword', {static: true}) inputPassword: ElementRef;
  @ViewChild('inputGC', {static: true}) inputGC: ElementRef;
  @ViewChild('inputRC', {static: true}) inputRC: ElementRef;
  @ViewChild('inputEmail', {static: true}) inputEmail: ElementRef;
  @ViewChild('inputEmailConfirm', {static: true}) inputEmailConfirm: ElementRef;

  private recaptchaSubscriber: Subscription;
  webData = {
    name: environment.nameWeb
  };

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
  loginFormD: FormGroup = this.formBuilder.group({
    email: [
      '', [Validators.required, Validators.email]
    ]
  });
  loginFormE: FormGroup = this.formBuilder.group({
    emailConfirm: [
      '', [Validators.required, Validators.pattern(/^([\a-zA-Z0-9]{8}|[\a-zA-Z0-9]{4}\s[\a-zA-Z0-9]{4})$/)]
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
  errorMSGE: string;
  errorMSGF: string;
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
    btn: null
  };
  messageData = {
    txt: null
  };

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private matSnackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private matDialog: MatDialog,
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
    // console.log('End');
  }

  stepper(idx: number) {
    // console.log(idx);
    this.currentIndex = this.nextIndex;
    this.nextIndex = idx;

    this.renderer2.setAttribute(this.mceCarousel.nativeElement, 'mce-carousel-selected', idx.toString());
    this.mce_carousel_update();
    if (idx === this.dataPageIndex.default) {
      this.pswdHide = true;
      if (this.currentIndex === this.dataPageIndex.message || this.currentIndex === this.dataPageIndex.resetAccount) {
        this.loginFormA.reset();
      } else {
        this.valA.password.reset();
      }
      this.loginFormA.markAsPristine();
      this.loginFormA.markAsUntouched();
    } else if (idx === this.dataPageIndex.googleCode) {
      this.loginFormB.reset();
      this.loginFormB.markAsPristine();
      this.loginFormB.markAsUntouched();
    } else if (idx === this.dataPageIndex.recoveryCode) {
      this.loginFormC.reset();
      this.loginFormC.markAsPristine();
      this.loginFormC.markAsUntouched();
    } else if (idx === this.dataPageIndex.resetAccount) {
      this.loginFormD.reset();
      this.loginFormD.markAsPristine();
      this.loginFormD.markAsUntouched();
    } else if (idx === this.dataPageIndex.resetConfirm) {
      this.loginFormE.reset();
      this.loginFormE.markAsPristine();
      this.loginFormE.markAsUntouched();
    }
    setTimeout(() => {
      if (idx === this.dataPageIndex.default) {
        this.resetData.text = null;
        if (this.currentIndex === this.dataPageIndex.message || this.dataPageIndex.resetAccount) {
          this.inputUsername.nativeElement.focus();
        } else {
          this.inputPassword.nativeElement.focus();
        }
      } else if (idx === this.dataPageIndex.googleCode) {
        this.inputGC.nativeElement.focus();
      } else if (idx === this.dataPageIndex.recoveryCode) {
        this.inputRC.nativeElement.focus();
      } else if (idx === this.dataPageIndex.resetAccount) {
        this.inputEmail.nativeElement.focus();
      } else if (idx === this.dataPageIndex.resetConfirm) {
        this.inputEmailConfirm.nativeElement.focus();
      }
      this.isLoading = false;
    }, 600);
  }

  goReset() {
    if (this.nextIndex === this.dataPageIndex.default) {
      this.resetData.text = 'Reset Password';
      this.resetData.btn = 'RESET';
    }
    if (this.nextIndex === this.dataPageIndex.googleCode || this.nextIndex === this.dataPageIndex.recoveryCode) {
      this.resetData.text = 'Reset 2FA Verification';
      this.resetData.btn = 'NEXT';
    }
    if (this.nextIndex === this.dataPageIndex.googleCode) {
      if (this.temporaryData.b2fa2) {
        this.stepper(this.dataPageIndex.recoveryCode);
      } else {
        this.stepper(this.dataPageIndex.resetAccount);
      }
    } else if (this.nextIndex === this.dataPageIndex.resetAccount || this.nextIndex === this.dataPageIndex.resetConfirm) {
      this.stepper(this.dataPageIndex.default);
    } else {
      this.stepper(this.dataPageIndex.resetAccount);
    }
  }

  goReset2FA() {
    this.stepper(this.dataPageIndex.resetConfirm);
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

  getErrorMessageEmail() {
    if (this.valD.email.hasError('required')) {
      this.errorMSGE = 'Please input your email';
    } else if (this.valD.email.hasError('email')) {
      this.errorMSGE = 'Email not valid';
    }
    return this.errorMSGE;
  }

  getErrorMessageEmailConfirm() {
    if (this.valE.emailConfirm.hasError('required')) {
      this.errorMSGF = 'Please input your email confirmation code';
    } else if (this.valE.emailConfirm.hasError('pattern')) {
      this.errorMSGF = 'Code not valid';
    }
    return this.errorMSGF;
  }

  getErrorMessagePrimary() {
    return this.errorMSG;
  }

  recaptchaUnsubscribe() {
    if (this.recaptchaSubscriber) {
      this.recaptchaSubscriber.unsubscribe();
    }
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

    this.recaptchaUnsubscribe();
    this.recaptchaSubscriber = this.recaptchaV3Service.execute('login_a1')
      .subscribe((token) => {
        this.authService.login_1(this.valA.username.value, this.valA.password.value, token).pipe(
          catchError(val => of(val))
        ).subscribe(
          (jsonData) => {
            console.log(jsonData);
            if (jsonData.status) {
              if (jsonData.data.code === 1) {
                const getCore = jsonData.data.core;
                this.authService.loginSet(getCore.id, getCore.username, getCore.token, getCore.xp);
                // console.log('Working code 1');
                this.matSnackBar.open('Loggin in...', 'close', {
                  duration: 3000
                });
                window.open('/', '_self');
                // window.location.replace("http://www.w3schools.com");
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
                // console.log('Working loop'); (let row of this.rows)
                for (const row of getDataError) {
                  // console.log(getDataError[index]);
                  if (row === 10) {
                    this.errorMSGA = 'Username or Email required';
                    this.valA.username.setErrors({required: true});
                  } else if (row === 11) {
                    this.errorMSGA = 'Username or Email to short';
                    this.valA.username.setErrors({minlength: true});
                  } else if (row === 12) {
                    this.errorMSGA = 'Username or Email to long';
                    this.valA.username.setErrors({maxlength: true});
                  } else if (row === 13) {
                    this.errorMSGA = jsonData.message;
                    this.valA.username.setErrors({available: true});
                  } else if (row === 20) {
                    this.errorMSGB = 'Password required';
                    this.valA.password.setErrors({required: true});
                  } else if (row === 21) {
                    this.errorMSGB = 'Password to short';
                    this.valA.password.setErrors({minlength: true});
                  } else if (row === 22) {
                    this.errorMSGB = 'Password to long';
                    this.valA.password.setErrors({maxlength: true});
                  } else if (row === 23) {
                    this.errorMSGB = jsonData.message;
                    this.valA.password.setErrors({wrong: true});
                  } else if (row === 3 || row === 90) {
                    this.errorMSG = jsonData.message;
                    this.isErrorPrimary = true;
                  }

                  if (row >= 0 && row < 20) {
                    this.inputUsername.nativeElement.focus();
                  } else if (row >= 20 && row < 30) {
                    this.inputPassword.nativeElement.focus();
                  }
                }
              }
              this.isLoading = false;
            }
            // console.log(this.loginFormA);
          },
          (err) => {
            this.isLoading = false;
            // this.isErrorCards.b = true;
            console.error(err);
          },
          () => {
            // this.isLoading = false;
            // console.log('observable complete');
            // this.isLoadCards.b = false;
          }
        );
      });
  }

  SubmitB() {
    if (this.loginFormB.invalid) {
      this.inputGC.nativeElement.focus();
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;

    this.recaptchaUnsubscribe();
    this.recaptchaSubscriber = this.recaptchaV3Service.execute('login_a2')
      .subscribe((token) => {
        this.authService.login_2x3(
          this.valA.username.value,
          this.valA.password.value,
          this.valB.googleCode.value,
          this.temporaryData.security,
          token,
          true
        ).pipe(
          catchError(val => of(val))
        ).subscribe(
          (jsonData) => {
            console.log(jsonData);
            if (jsonData.status) {
              const getCore = jsonData.data.core;
              this.authService.loginSet(getCore.id, getCore.username, getCore.token, getCore.xp);
              this.matSnackBar.open('Loggin in...', 'close', {
                duration: 3000
              });
              window.open('/', '_self');
            } else {
              const getDataError = jsonData.data.code;
              if (getDataError.length !== undefined && getDataError.length > 0) {
                console.log('Working loop');
                for (const row of getDataError) {
                  console.log(getDataError);
                  if (row === 30) {
                    this.errorMSGC = 'Google auth key required';
                    this.valB.googleCode.setErrors({required: true});
                  } else if (row === 31) {
                    this.errorMSGC = 'Google auth key to short';
                    this.valB.googleCode.setErrors({short: true});
                  } else if (row === 32) {
                    this.errorMSGC = 'Google auth key to long';
                    this.valB.googleCode.setErrors({long: true});
                  } else if (row === 33) {
                    console.log('Not valid');
                    this.errorMSGC = 'Google auth key not valid';
                    this.valB.googleCode.setErrors({notvalid: true});
                  } else if (row === 3 || row === 90) {
                    this.errorMSG = jsonData.message;
                    this.isErrorPrimary = true;
                  }
                  this.inputGC.nativeElement.focus();
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
      });
  }

  SubmitC() {
    if (this.loginFormC.invalid) {
      this.inputRC.nativeElement.focus();
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;

    this.recaptchaUnsubscribe();
    this.recaptchaSubscriber = this.recaptchaV3Service.execute('login_a3')
      .subscribe((token) => {
        this.authService.login_2x3(
          this.valA.username.value,
          this.valA.password.value,
          this.valC.recoveryCode.value,
          this.temporaryData.security,
          token,
          false
        ).pipe(
          catchError(val => of(val))
        ).subscribe(
          (jsonData) => {
            console.log(jsonData);
            if (jsonData.status) {
              const getCore = jsonData.data.core;
              this.authService.loginSet(getCore.id, getCore.username, getCore.token, getCore.xp);
              this.matSnackBar.open('Loggin in...', 'close', {
                duration: 3000
              });
              window.open('/', '_self');
            } else {
              const getDataError = jsonData.data.code;
              if (getDataError.length !== undefined && getDataError.length > 0) {
                for (const row of getDataError) {
                  if (row === 30) {
                    this.errorMSGD = 'Recovery code required';
                    this.valC.recoveryCode.setErrors({required: true});
                  } else if (row === 31) {
                    this.errorMSGD = 'Recovery code to short';
                    this.valC.recoveryCode.setErrors({short: true});
                  } else if (row === 32) {
                    this.errorMSGD = 'Recovery code to long';
                    this.valC.recoveryCode.setErrors({long: true});
                  } else if (row === 34) {
                    this.errorMSGD = 'You do not have recovery code';
                    this.valC.recoveryCode.setErrors({empty: true});
                  } else if (row === 35) {
                    this.errorMSGD = 'Recovery code not valid';
                    this.valC.recoveryCode.setErrors({notvalid: true});
                  } else if (row === 36) {
                    this.errorMSGD = 'Recovery code has been used';
                    this.valC.recoveryCode.setErrors({used: true});
                  } else if (row === 3 || row === 90) {
                    this.errorMSG = jsonData.message;
                    this.isErrorPrimary = true;
                  }
                  this.inputRC.nativeElement.focus();
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
      });
  }

  SubmitD() {
    if (this.loginFormD.invalid) {
      this.inputEmail.nativeElement.focus();
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;

    this.recaptchaUnsubscribe();
    this.recaptchaSubscriber = this.recaptchaV3Service.execute('login_a4')
      .subscribe((token) => {
        let isCurrent = 0;
        if (this.nextIndex === this.dataPageIndex.default) {
          isCurrent = 1;
        } else if (this.nextIndex === this.dataPageIndex.googleCode || this.nextIndex === this.dataPageIndex.recoveryCode) {
          isCurrent = 2;
        }
        this.authService.login_request(
          this.valD.email.value,
          token,
          isCurrent
        ).pipe(
          catchError(val => of(val))
        ).subscribe(
          (jsonData) => {
            console.log(jsonData);
            if (jsonData.status) {
              if (jsonData.data.code === 1) {
                this.messageData.txt = jsonData.data.core.message;
                this.stepper(this.dataPageIndex.message);
              } else if (jsonData.data.code === 2) {
                this.temporaryData.username = this.valD.email.value;
                this.stepper(this.dataPageIndex.resetConfirm);
              }
            } else {
              const getDataError = jsonData.data.code;
              if (getDataError.length !== undefined && getDataError.length > 0) {
                for (const row of getDataError) {
                  if (row === 50) {
                    this.errorMSGE = 'Email required';
                    this.valD.email.setErrors({required: true});
                  } else if (row === 51) {
                    this.errorMSGE = 'Email not valid';
                    this.valD.email.setErrors({email: true});
                  } else if (row === 52) {
                    this.errorMSGE = 'Email account not found';
                    this.valD.email.setErrors({notfound: true});
                  } else if (row === 53) {
                    this.errorMSGE = 'Email domain not valid';
                    this.valD.email.setErrors({domain: true});
                  } else if (row === 3 || row === 90) {
                    this.errorMSG = jsonData.message;
                    this.isErrorPrimary = true;
                  }
                  this.inputEmail.nativeElement.focus();
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
      });
  }

  SubmitE() {
    if (this.loginFormE.invalid) {
      this.inputEmailConfirm.nativeElement.focus();
      return;
    }

    if (this.temporaryData.username === null) {
      this.openDialog();
    } else {
      this.isErrorPrimary = false;
      this.isLoading = true;

      this.recaptchaUnsubscribe();
      this.recaptchaSubscriber = this.recaptchaV3Service.execute('login_a5')
        .subscribe((token) => {
          this.authService.login_request_confirm(
            this.temporaryData.username,
            this.valE.emailConfirm.value,
            token
          ).pipe(
            catchError(val => of(val))
          ).subscribe(
            (jsonData) => {
              console.log(jsonData);
              if (jsonData.status) {
                this.messageData.txt = jsonData.data.core.message;
                this.stepper(this.dataPageIndex.message);
              } else {
                const getDataError = jsonData.data.code;
                if (getDataError.length !== undefined && getDataError.length > 0) {
                  for (const row of getDataError) {
                    if (row === 30) {
                      this.errorMSGF = 'Code required';
                      this.valE.emailConfirm.setErrors({required: true});
                    } else if (row === 31) {
                      this.errorMSGF = 'Code to short';
                      this.valE.emailConfirm.setErrors({min: true});
                    } else if (row === 32) {
                      this.errorMSGF = 'Code to long';
                      this.valE.emailConfirm.setErrors({max: true});
                    } else if (row === 33) {
                      this.errorMSGF = 'The code was expired';
                      this.valE.emailConfirm.setErrors({exp: true});
                    } else if (row === 34) {
                      this.errorMSGF = 'The code not valid';
                      this.valE.emailConfirm.setErrors({valid: true});
                    } else if (row === 50) {
                      this.errorMSG = 'Email required';
                      this.isErrorPrimary = true;
                    } else if (row === 51) {
                      this.errorMSG = 'Email not valid';
                      this.isErrorPrimary = true;
                      this.temporaryData.username = null;
                    } else if (row === 52) {
                      this.errorMSG = 'Email account not found';
                      this.isErrorPrimary = true;
                      this.temporaryData.username = null;
                    } else if (row === 3 || row === 90) {
                      this.errorMSG = jsonData.message;
                      this.isErrorPrimary = true;
                    }
                    this.inputEmailConfirm.nativeElement.focus();
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
        });
    }


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

  get valD() {
    return this.loginFormD.controls;
  }

  get valE() {
    return this.loginFormE.controls;
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(SigninDialogComponent, {
      width: '450px',
      data: {
        dialogEmail: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // this.messageData.txt = result;
      if (result === null) {
        this.openDialog();
      } else if (result === false) {
        this.temporaryData.username = result;
        this.SubmitE();
      }

    });
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

  ngOnDestroy() {
    this.recaptchaUnsubscribe();
  }

}
