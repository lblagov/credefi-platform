import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, Inject, PLATFORM_ID, OnInit, Output, EventEmitter, AfterViewInit, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { intersectionObserver } from './intersection-observer';

@Component({
  selector: 'lazy-image',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class LazyImage implements OnInit, AfterViewInit {

  init = false
  _src!: string;
  _width: string = '100%';
  _height: string = '100%';
  _objectFit: string = 'unset';
  _verticalAlign: string = 'unset';
  _borderRadius: string = 'unset';
  _animation: boolean = false;

  @Output() load = new EventEmitter();

  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('img', { static: true }) img!: ElementRef<HTMLImageElement>;
  @ViewChild('loader', { static: true }) loader!: ElementRef<HTMLImageElement>;

  constructor(
    public element: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  @Input()
  set src(src: string) {
    this._src = src;
    if (this.init && isPlatformBrowser(this.platformId) && this.img instanceof ElementRef) {
      if (this.animation) {
        this.loader.nativeElement.style.visibility = "visible";
      }
      this.img.nativeElement.src = src;
    }
  }

  get src() {
    return this._src;
  }

  @Input()
  set width(width: string) {
    this._width = width;
  }

  get width() {
    return this._width;
  }

  @Input()
  set height(height: string) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  @Input()
  set objectFit(objectFit: string) {
    this._objectFit = objectFit;
  }

  get objectFit() {
    return this._objectFit;
  }

  @Input()
  set verticalAlign(verticalAlign: string) {
    this._verticalAlign = verticalAlign;
  }

  get verticalAlign() {
    return this._verticalAlign;
  }

  @Input()
  set borderRadius(borderRadius: string) {
    this._borderRadius = borderRadius;
  }

  get borderRadius() {
    return this._borderRadius;
  }

  @Input()
  set animation(animation: boolean) {
    this._animation = animation;
  }

  get animation() {
    return this._animation;
  }


  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      this.ngZone.runOutsideAngular(() => {

        intersectionObserver.observe(this.container.nativeElement, this.loaded.bind(this)).catch(() => {
          this.loaded();
        });

      });

    }

  }

  ngAfterViewInit() {
    this.init = true;
  }

  loaded() {
    this.img.nativeElement.src = this.src;
    this.img.nativeElement.classList.add('ng-lazyloaded');
    this.img.nativeElement.onload = this.onload.bind(this);
  }

  onload() {
    this.ngZone.runOutsideAngular(() => {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.loader.nativeElement.style.visibility = "hidden";
        }, 200);
      }
      this.load.emit();
    });
  }

}
