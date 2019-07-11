import { Component, Input, Output, EventEmitter, } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-bullets',
    templateUrl: './gallery-bullets.component.html',
    styleUrls: ['./gallery-bullets.component.scss']
})
export class GalleryBulletsComponent {
    @Input() count: number;
    @Input() active: number = 0;

    @Output() onChange = new EventEmitter();

    getBullets(): number[] {
        return Array(this.count);
    }

    handleChange(_event: Event, index: number): void {
        this.onChange.emit(index);
    }
}
