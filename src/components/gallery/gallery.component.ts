import { Component, Input, HostListener, ViewChild, OnInit,
    HostBinding, DoCheck, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { GalleryPreviewComponent } from '../gallery-preview/gallery-preview.component';
import { GalleryImageComponent } from '../gallery-image/gallery-image.component';
import { GalleryThumbnailsComponent } from '../gallery-thumbnails/gallery-thumbnails.component';
import { GalleryHelperService } from '../../services/gallery-helper.service';

import { GalleryOptions } from '../../models/gallery-options.model';
import { GalleryImage } from '../../models/gallery-image.model';
import { GalleryLayout } from '../../models/gallery-layout.model';
import { GalleryOrderedImage } from '../../models/gallery-ordered-image.model';

@Component({
    moduleId: module.id,
    selector: 'o-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    providers: [GalleryHelperService]
})
export class GalleryComponent implements OnInit, DoCheck, AfterViewInit   {
    @Input() options: GalleryOptions[];
    @Input() images: GalleryImage[];

    @Output() imagesReady = new EventEmitter();
    @Output() change = new EventEmitter<{ index: number; image: GalleryImage; }>();
    @Output() previewOpen = new EventEmitter();
    @Output() previewClose = new EventEmitter();
    @Output() previewChange = new EventEmitter<{ index: number; image: GalleryImage; }>();

    smallImages: string[] | SafeResourceUrl[];
    mediumImages: GalleryOrderedImage[];
    bigImages: string[] | SafeResourceUrl[];
    descriptions: string[];
    links: string[];
    labels: string[];

    oldImages: GalleryImage[];
    oldImagesLength = 0;

    selectedIndex = 0;
    previewEnabled: boolean;

    currentOptions: GalleryOptions;

    private breakpoint: number | undefined = undefined;
    private prevBreakpoint: number | undefined = undefined;
    private fullWidthTimeout: any;

    @ViewChild(GalleryPreviewComponent) preview: GalleryPreviewComponent;
    @ViewChild(GalleryImageComponent) image: GalleryImageComponent;
    @ViewChild(GalleryThumbnailsComponent) thubmnails: GalleryThumbnailsComponent;

    @HostBinding('style.width') width: string;
    @HostBinding('style.height') height: string;
    @HostBinding('style.left') left: string;

    constructor(private myElement: ElementRef, private helperService: GalleryHelperService) {}

    ngOnInit() {
        this.options = this.options.map((opt) => new GalleryOptions(opt));
        this.sortOptions();
        this.setBreakpoint();
        this.setOptions();
        this.checkFullWidth();
        if (this.currentOptions) {
            this.selectedIndex = <number>this.currentOptions.startIndex;
        }
    }

    ngDoCheck(): void {
        if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
            || (this.images !== this.oldImages)) {
            this.oldImagesLength = this.images.length;
            this.oldImages = this.images;
            this.setOptions();
            this.setImages();

            if (this.images && this.images.length) {
                this.imagesReady.emit();
            }

            if (this.image) {
                this.image.reset(<number>this.currentOptions.startIndex);
            }

            if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails
                && this.images.length <= 1) {
                this.currentOptions.thumbnails = false;
                this.currentOptions.imageArrows = false;
            }

            this.resetThumbnails();
        }
    }

    ngAfterViewInit(): void {
        this.checkFullWidth();
    }

    @HostListener('window:resize') onResize() {
        this.setBreakpoint();

        if (this.prevBreakpoint !== this.breakpoint) {
            this.setOptions();
            this.resetThumbnails();
        }

        if (this.currentOptions && this.currentOptions.fullWidth) {

            if (this.fullWidthTimeout) {
                clearTimeout(this.fullWidthTimeout);
            }

            this.fullWidthTimeout = setTimeout(() => {
                this.checkFullWidth();
            }, 200);
        }
    }

    getImageHeight(): string {
        return (this.currentOptions && this.currentOptions.thumbnails) ?
            this.currentOptions.imagePercent + '%' : '100%';
    }

    getThumbnailsHeight(): string {
        if (this.currentOptions && this.currentOptions.image) {
            return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
            + this.currentOptions.thumbnailsMargin + 'px)';
        } else {
            return '100%';
        }
    }

    getThumbnailsMarginTop(): string {
        if (this.currentOptions && this.currentOptions.layout === GalleryLayout.ThumbnailsBottom) {
            return this.currentOptions.thumbnailsMargin + 'px';
        } else {
            return '0px';
        }
    }

    getThumbnailsMarginBottom(): string {
        if (this.currentOptions && this.currentOptions.layout === GalleryLayout.ThumbnailsTop) {
            return this.currentOptions.thumbnailsMargin + 'px';
        } else {
            return '0px';
        }
    }

    openPreview(index: number): void {
        if (this.currentOptions.previewCustom) {
            this.currentOptions.previewCustom(index);
        } else {
            this.previewEnabled = true;
            this.preview.open(index);
        }
    }

    onPreviewOpen(): void {
        this.previewOpen.emit();

        if (this.image && this.image.autoPlay) {
            this.image.stopAutoPlay();
        }
    }

    onPreviewClose(): void {
        this.previewEnabled = false;
        this.previewClose.emit();

        if (this.image && this.image.autoPlay) {
            this.image.startAutoPlay();
        }
    }

    selectFromImage(index: number) {
        this.select(index);
    }

    selectFromThumbnails(index: number) {
        this.select(index);

        if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
            && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
            this.openPreview(this.selectedIndex);
        }
    }

    show(index: number): void {
        this.select(index);
    }

    showNext(): void {
        this.image.showNext();
    }

    showPrev(): void {
        this.image.showPrev();
    }

    canShowNext(): boolean {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
                ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
        } else {
            return false;
        }
    }

    previewSelect(index: number) {
        this.previewChange.emit({index, image: this.images[index]});
    }

    moveThumbnailsRight() {
        this.thubmnails.moveRight();
    }

    moveThumbnailsLeft() {
        this.thubmnails.moveLeft();
    }

    canMoveThumbnailsRight() {
        return this.thubmnails.canMoveRight();
    }

    canMoveThumbnailsLeft() {
        return this.thubmnails.canMoveLeft();
    }

    private resetThumbnails() {
        if (this.thubmnails) {
            this.thubmnails.reset(<number>this.currentOptions.startIndex);
        }
    }

    private select(index: number) {
        this.selectedIndex = index;

        this.change.emit({
            index,
            image: this.images[index]
        });
    }

    private checkFullWidth(): void {
        if (this.currentOptions && this.currentOptions.fullWidth) {
            this.width = document.body.clientWidth + 'px';
            this.left = (-(document.body.clientWidth -
                this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
        }
    }

    private setImages(): void {
        this.images.forEach((img) =>
            img.type = this.helperService.getFileType(<string>img.url || <string>img.big || <string>img.medium || <string>img.small || '')
        );
        this.smallImages = this.images.map((img) => <string>img.small);
        this.mediumImages = this.images.map((img, i) => new GalleryOrderedImage({
            src: img.medium,
            type: img.type,
            index: i
        }));
        this.bigImages = this.images.map((img) => <string>img.big);
        this.descriptions = this.images.map((img) => <string>img.description);
        this.links = this.images.map((img) => <string>img.url);
        this.labels = this.images.map((img) => <string>img.label);
    }

    private setBreakpoint(): void {
        this.prevBreakpoint = this.breakpoint;
        let breakpoints;

        if (typeof window !== 'undefined') {
            breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
                .map((opt) => opt.breakpoint);
        }

        if (breakpoints && breakpoints.length) {
            this.breakpoint = breakpoints.pop();
        } else {
            this.breakpoint = undefined;
        }
    }

    private sortOptions(): void {
        this.options = [
            ...this.options.filter((a) => a.breakpoint === undefined),
            ...this.options
                .filter((a) => a.breakpoint !== undefined)
                .sort((a, b) => b.breakpoint - a.breakpoint)
        ];
    }

    private setOptions(): void {
        this.currentOptions = new GalleryOptions({});

        this.options
            .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
            .map((opt) => this.combineOptions(this.currentOptions, opt));

        this.width = <string>this.currentOptions.width;
        this.height = <string>this.currentOptions.height;
    }

    private combineOptions(first: GalleryOptions, second: GalleryOptions) {
        Object.keys(second).map((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
    }
}

