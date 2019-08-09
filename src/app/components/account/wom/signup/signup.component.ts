import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'manga-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('mceCarousel', {static: true}) mceCarousel: ElementRef;
  @ViewChild('mceCarouselItems', {static: true}) mceCarouselItems: ElementRef;
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
    username: [
      '', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
    ],
    email: [
      '', [Validators.required, Validators.email]
    ],
    password1: [
      '', [Validators.required, Validators.minLength(8)]
    ],
    password2: [
      '', [Validators.required, Validators.minLength(8)]
    ]
  });
  regFormB: FormGroup = this.formBuilder.group({
    namea: [
      '', [Validators.required]
    ],
    nameb: [
      '', [Validators.required]
    ],
  });
  errorMSGA = {
    a: '',
    b: '',
    c: '',
    d: ''
  };

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private renderer2: Renderer2,
    private formBuilder: FormBuilder,
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
    }
    return this.errorMSGA.c;
  }

  getErrorMessagePassword2() {
    if (this.valA.password2.hasError('required')) {
      this.errorMSGA.d = 'Please input password';
    } else if (this.valA.password2.hasError('minlength')) {
      this.errorMSGA.d = 'Password to short';
    }
    return this.errorMSGA.d;
  }

  getErrorMessagePrimary() {
    return '';
  }

  get valA() {
    return this.regFormA.controls;
  }

  SubmitA() {
    
  }

  ngOnInit() {
    this.mce_carousel_init();
  }

}
