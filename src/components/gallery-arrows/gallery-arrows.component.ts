import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-arrows',
    templateUrl: './gallery-arrows.component.html',
    styleUrls: ['./gallery-arrows.component.scss']
})
export class GalleryArrowsComponent {
    @Input() prevDisabled: boolean;
    @Input() nextDisabled: boolean;
    @Input() arrowPrevIcon: string;
    @Input() arrowNextIcon: string;

    @Output() onPrevClick = new EventEmitter();
    @Output() onNextClick = new EventEmitter();

    handlePrevClick(): void {
        this.onPrevClick.emit();
    }

    handleNextClick(): void {
        this.onNextClick.emit();
    }
}
