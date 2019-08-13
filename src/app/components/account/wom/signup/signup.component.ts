import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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
  strenghtMSG: string;
  strenghtPoint: number;
  recentToken: any;
  recaptchaSubscription: Subscription;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private renderer2: Renderer2,
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService
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

  getErrorMessageUsername() {
    if (this.valA.username.hasError('required')) {
      this.errorMSGA.a = 'Please input username';
    } else if (this.valA.username.hasError('minlength')) {
      this.errorMSGA.a = 'Username to short';
    } else if (this.valA.username.hasError('maxlength')) {
      this.errorMSGA.a = 'Username to long';
    }
    return this.errorMSGA.a;
  }

  getErrorMessageEmail() {
    if (this.valA.email.hasError('required')) {
      this.errorMSGA.b = 'Please input email';
    } else if (this.valA.email.hasError('email')) {
      this.errorMSGA.b = 'Email does not valid';
    } else if (this.valA.email.hasError('minlength')) {
      this.errorMSGA.b = 'Email to short';
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
    } else if (this.valA.password2.hasError('notmatch')) {
      this.errorMSGA.d = 'Password does not match';
    }
    return this.errorMSGA.d;
  }

  getErrorMessageName1() {
    if (this.valA.name1.hasError('required')) {
      this.errorMSGA.e = 'Please input your first name';
    }
    return this.errorMSGA.e;
  }

  getErrorMessageName2() {
    if (this.valA.name2.hasError('required')) {
      this.errorMSGA.f = 'Please input your last name';
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
    const curentPass1 = this.valA.password1.value || '';
    const curentPass2 = event.target.value || '';
    if (curentPass1 !== curentPass2) {
      this.valA.password2.setErrors({notmatch: true});
    }
  }

  get valA() {
    return this.regFormA.controls;
  }

  handleEmittedResponse(response) {
    console.log(response);
    /* if(response === null) {
        // Response is null due to what? Expiration? reset?
        if(this.subscription){ // Cancel subscription
            this.subscription.unsubscribe();
        }
        return;
    }
    else{
        this.subscription = this.http.post(url).subscribe((data) => {
            if(data.error) { // Server validation failed
                // Print Error
                this.iRecaptcha.reset(); // This will un-necessarrily send null to handleEmittedResponse() now
            }
            else {
               // Rejoice! Print success
                this.iRecaptcha.reset(); // Enable user to re-send another request. Will send null in this case too
            }
        })
    } */
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

    this.recaptchaUnsubscribe();
    this.recaptchaSubscription = this.recaptchaV3Service.execute('test')
      .subscribe(
        (token) => {
          this.recentToken = token;
        },
        err => console.log('Something went wrong', err),
        () => console.log('Recaptcha completed.')
      );
  }

  recaptchaUnsubscribe() {
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.mce_carousel_init();
  }

  ngOnDestroy() {
    this.recaptchaUnsubscribe();
  }

}
