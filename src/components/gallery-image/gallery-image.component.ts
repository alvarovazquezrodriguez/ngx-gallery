import { Component, EventEmitter, HostListener, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { InputConverter } from 'ontimize-web-ngx';
import { GalleryHelperService } from '../../services/gallery-helper.service';
import { GalleryOrderedImage } from '../../models/gallery-ordered-image.model';
import { GalleryAnimation } from '../../models/gallery-animation.model';
import { GalleryAction } from '../../models/gallery-action.model';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-image',
    templateUrl: './gallery-image.component.html',
    styleUrls: ['./gallery-image.component.scss'],
    inputs: [
        'images',
        'clickable',
        'selectedIndex : selected-index',
        'arrows',
        'arrowsAutoHide : arrows-auto-hide',
        'swipe',
        'animation',
        'size',
        'arrowPrevIcon : arrow-prev-icon',
        'arrowNextIcon : arrow-next-icon',
        'autoPlay : auto-play',
        'autoPlayInterval : auto-play-interval',
        'autoPlayPauseOnHover : auto-play-pause-on-hover',
        'infinityMove : infinity-move',
        'lazyLoading : lazy-loading',
        'actions',
        'descriptions',
        'showDescription : show-description',
        'bullets'
    ],
    outputs: [
        'onClick',
        'onActiveChange'
    ]
})
export class GalleryImageComponent implements OnInit, OnChanges {
    public images: GalleryOrderedImage[];
    @InputConverter()
    public clickable: boolean;
    public selectedIndex: number;
    @InputConverter()
    public arrows: boolean;
    @InputConverter()
    public arrowsAutoHide: boolean;
    @InputConverter()
    public swipe: boolean;
    public animation: string;
    public size: string;
    public arrowPrevIcon: string;
    public arrowNextIcon: string;
    @InputConverter()
    public autoPlay: boolean;
    public autoPlayInterval: number;
    @InputConverter()
    public autoPlayPauseOnHover: boolean;
    @InputConverter()
    public infinityMove: boolean;
    @InputConverter()
    public lazyLoading: boolean;
    public actions: GalleryAction[];
    public descriptions: string[];
    @InputConverter()
    public showDescription: boolean;
    @InputConverter()
    public bullets: boolean;

    onClick = new EventEmitter();
    onActiveChange = new EventEmitter();

    canChangeImage = true;

    private timer;

    constructor(private sanitization: DomSanitizer,
        private elementRef: ElementRef, private helperService: GalleryHelperService) {}

    ngOnInit(): void {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }

        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }

        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }

        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }

    reset(index: number): void {
        this.selectedIndex = index;
    }

    getImages(): GalleryOrderedImage[] {
        if (!this.images) {
            return [];
        }

        if (this.lazyLoading) {
            let indexes = [this.selectedIndex];
            let prevIndex = this.selectedIndex - 1;

            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1);
            } else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }

            let nextIndex = this.selectedIndex + 1;

            if (nextIndex === this.images.length && this.infinityMove) {
                indexes.push(0);
            } else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }

            return this.images.filter((_img, i) => indexes.indexOf(i) !== -1);
        } else {
            return this.images;
        }
    }

    startAutoPlay(): void {
        this.stopAutoPlay();

        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    handleClick(event: Event, index: number): void {
        if (this.clickable) {
            this.onClick.emit(index);

            event.stopPropagation();
            event.preventDefault();
        }
    }

    show(index: number) {
        this.selectedIndex = index;
        this.onActiveChange.emit(this.selectedIndex);
        this.setChangeTimeout();
    }

    showNext(): boolean {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex++;

            if (this.selectedIndex === this.images.length) {
                this.selectedIndex = 0;
            }

            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();

            return true;
        } else {
            return false;
        }
    }

    showPrev(): void {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex--;

            if (this.selectedIndex < 0) {
                this.selectedIndex = this.images.length - 1;
            }

            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }

    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = 1000;

        if (this.animation === GalleryAnimation.Slide
            || this.animation === GalleryAnimation.Fade) {
            timeout = 500;
        }

        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }

    canShowNext(): boolean {
        if (this.images) {
            return this.infinityMove || this.selectedIndex < this.images.length - 1
                ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images) {
            return this.infinityMove || this.selectedIndex > 0 ? true : false;
        } else {
            return false;
        }
    }

    getSafeUrl(image: string): SafeStyle {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }

    getFileType(fileSource: string) {
        return this.helperService.getFileType(fileSource);
    }
}
