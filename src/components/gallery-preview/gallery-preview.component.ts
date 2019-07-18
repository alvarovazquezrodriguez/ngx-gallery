import { ChangeDetectorRef, Component, EventEmitter, OnInit,
    OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { InputConverter } from 'ontimize-web-ngx';
import { GalleryAction } from '../../models/gallery-action.model';
import { GalleryHelperService } from '../../services/gallery-helper.service';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-preview',
    templateUrl: './gallery-preview.component.html',
    styleUrls: ['./gallery-preview.component.scss'],
    inputs: [
    'images',
    'descriptions',
    'showDescription : show-description',
    'arrows',
    'arrowsAutoHide : arrows-auto-hide',
    'swipe',
    'fullscreen',
    'forceFullscreen : force-fullscreen',
    'closeOnClick : close-on-click',
    'closeOnEsc : close-on-esc',
    'keyboardNavigation : keyboard-navigation',
    'arrowPrevIcon : arrow-prev-icon',
    'arrowNextIcon : arrow-next-icon',
    'closeIcon : close-icon',
    'fullscreenIcon : fullscreen-icon',
    'spinnerIcon : spinner-icon',
    'autoPlay : auto-play',
    'autoPlayInterval : auto-play-interval',
    'autoPlayPauseOnHover : auto-play-pause-on-hover',
    'infinityMove : infinity-move',
    'zoom',
    'zoomStep : zoom-step',
    'zoomMax : zoom-max',
    'zoomMin : zoom-min',
    'zoomInIcon : zoom-in-icon',
    'zoomOutIcon : zoom-out-icon',
    'animation',
    'actions',
    'rotate',
    'rotateLeftIcon : rotate-left-icon',
    'rotateRightIcon : rotate-right-icon',
    'download',
    'downloadIcon : download-icon',
    'bullets'
    ],
    outputs: [
        'onOpen',
        'onClose',
        'onActiveChange'
    ]
})

export class GalleryPreviewComponent implements OnInit, OnChanges {

    src: SafeUrl;
    srcIndex: number;
    description: string;
    type: string;
    showSpinner = false;
    positionLeft = 0;
    positionTop = 0;
    zoomValue = 1;
    loading = false;
    rotateValue = 0;
    index = 0;

    public images: string[] | SafeResourceUrl[];
    public descriptions: string[];
    @InputConverter()
    public showDescription: boolean;
    @InputConverter()
    public arrows: boolean;
    @InputConverter()
    public arrowsAutoHide: boolean;
    @InputConverter()
    public swipe: boolean;
    @InputConverter()
    public fullscreen: boolean;
    @InputConverter()
    public forceFullscreen: boolean;
    @InputConverter()
    public closeOnClick: boolean;
    @InputConverter()
    public closeOnEsc: boolean;
    @InputConverter()
    public keyboardNavigation: boolean;
    public arrowPrevIcon: string;
    public arrowNextIcon: string;
    public closeIcon: string;
    public fullscreenIcon: string;
    public spinnerIcon: string;
    @InputConverter()
    public autoPlay: boolean;
    public autoPlayInterval: number;
    @InputConverter()
    public autoPlayPauseOnHover: boolean;
    @InputConverter()
    public infinityMove: boolean;
    @InputConverter()
    public zoom: boolean;
    public zoomStep: number;
    public zoomMax: number;
    public zoomMin: number;
    public zoomInIcon: string;
    public zoomOutIcon: string;
    @InputConverter()
    public animation: boolean;
    public actions: GalleryAction[];
    @InputConverter()
    public rotate: boolean;
    public rotateLeftIcon: string;
    public rotateRightIcon: string;
    @InputConverter()
    public download: boolean;
    public downloadIcon: string;
    public bullets: string;

    onOpen = new EventEmitter();
    onClose = new EventEmitter();
    onActiveChange = new EventEmitter<number>();

    @ViewChild('previewImage') previewImage: ElementRef;

    private isOpen = false;
    private timer;
    private initialX = 0;
    private initialY = 0;
    private initialLeft = 0;
    private initialTop = 0;
    private isMove = false;

    private keyDownListener: Function;

    constructor(private sanitization: DomSanitizer, private elementRef: ElementRef,
        private helperService: GalleryHelperService, private renderer: Renderer2,
        private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef,
            'preview', () => this.showNext(), () => this.showPrev());
        }
    }

    ngOnDestroy() {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    }

    onKeyDown(e) {
        if (this.isOpen) {
            if (this.keyboardNavigation) {
                if (this.isKeyboardPrev(e)) {
                    this.showPrev();
                } else if (this.isKeyboardNext(e)) {
                    this.showNext();
                }
            }
            if (this.closeOnEsc && this.isKeyboardEsc(e)) {
                this.close();
            }
        }
    }

    open(index: number): void {
        this.onOpen.emit();

        this.index = index;
        this.isOpen = true;
        this.show(true);

        if (this.forceFullscreen) {
            this.manageFullscreen();
        }

        this.keyDownListener = this.renderer.listen('window', 'keydown', (e) => this.onKeyDown(e));
    }

    close(): void {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();

        this.stopAutoPlay();

        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }

    imageMouseEnter(): void {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }

    imageMouseLeave(): void {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }

    startAutoPlay(): void {
        if (this.autoPlay) {
            this.stopAutoPlay();

            this.timer = setTimeout(() => {
                if (!this.showNext()) {
                    this.index = -1;
                    this.showNext();
                }
            }, this.autoPlayInterval);
        }
    }

    stopAutoPlay(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    showAtIndex(index: number): void {
        this.index = index;
        this.show();
    }

    showNext(): boolean {
        if (this.canShowNext()) {
            this.index++;

            if (this.index === this.images.length) {
                this.index = 0;
            }

            this.show();
            return true;
        } else {
            return false;
        }
    }

    showPrev(): void {
        if (this.canShowPrev()) {
            this.index--;

            if (this.index < 0) {
                this.index = this.images.length - 1;
            }

            this.show();
        }
    }

    canShowNext(): boolean {
        if (this.loading) {
            return false;
        } else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.loading) {
            return false;
        } else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        } else {
            return false;
        }
    }

    manageFullscreen(): void {
        if (this.fullscreen || this.forceFullscreen) {
            const doc = <any>document;

            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            } else {
                this.closeFullscreen();
            }
        }
    }

    getSafeUrl(image: string): SafeUrl {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    }

    getFileType (fileSource: string): string {
        return this.helperService.getFileType(fileSource);
    }

    zoomIn(): void {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;

            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    }

    zoomOut(): void {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;

            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }

            if (this.zoomValue <= 1) {
                this.resetPosition();
            }
        }
    }

    rotateLeft(): void {
        this.rotateValue -= 90;
    }

    rotateRight(): void {
        this.rotateValue += 90;
    }

    getTransform(): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    }

    canZoomIn(): boolean {
        return this.zoomValue < this.zoomMax ? true : false;
    }

    canZoomOut(): boolean {
        return this.zoomValue > this.zoomMin ? true : false;
    }

    canDragOnZoom() {
        return this.zoom && this.zoomValue > 1;
    }

    mouseDownHandler(e): void {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;

            e.preventDefault();
        }
    }

    mouseUpHandler(_e): void {
        this.isMove = false;
    }

    mouseMoveHandler(e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    }

    private getClientX(e): number {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    }

    private getClientY(e): number {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    }

    private resetPosition() {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    }

    private isKeyboardNext(e): boolean {
        return e.keyCode === 39 ? true : false;
    }

    private isKeyboardPrev(e): boolean {
        return e.keyCode === 37 ? true : false;
    }

    private isKeyboardEsc(e): boolean {
        return e.keyCode === 27 ? true : false;
    }

    private openFullscreen(): void {
        const element = <any>document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }

    private closeFullscreen(): void {
        if (this.isFullscreen()) {
            const doc = <any>document;

            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        }
    }

    private isFullscreen() {
        const doc = <any>document;

        return doc.fullscreenElement || doc.webkitFullscreenElement
            || doc.mozFullScreenElement || doc.msFullscreenElement;
    }



    private show(first = false) {
        this.loading = true;
        this.stopAutoPlay();

        this.onActiveChange.emit(this.index);

        if (first || !this.animation) {
            this._show();
        } else {
            setTimeout(() => this._show(), 600);
        }
    }

    private _show() {
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();

        this.src = this.getSafeUrl(<string>this.images[this.index]);
        this.type = this.getFileType(<string>this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];
        this.changeDetectorRef.markForCheck();

        setTimeout(() => {
            if (this.isLoaded(this.previewImage.nativeElement) || this.type === 'video') {
                this.loading = false;
                this.startAutoPlay();
                this.changeDetectorRef.markForCheck();
            // tslint:disable-next-line: no-empty
            } else if (this.type === 'video') {

            } else {
                setTimeout(() => {
                    if (this.loading) {
                        this.showSpinner = true;
                        this.changeDetectorRef.markForCheck();
                    }
                });

                this.previewImage.nativeElement.onload = () => {
                    this.loading = false;
                    this.showSpinner = false;
                    this.previewImage.nativeElement.onload = null;
                    this.startAutoPlay();
                    this.changeDetectorRef.markForCheck();
                };
            }
        });
    }

    private isLoaded(img): boolean {
        if (!img.complete) {
            return false;
        }

        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }

        return true;
    }
}
