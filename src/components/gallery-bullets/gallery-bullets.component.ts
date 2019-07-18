import { Component, EventEmitter, } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-bullets',
    templateUrl: './gallery-bullets.component.html',
    styleUrls: ['./gallery-bullets.component.scss'],
    inputs: [
        'count',
        'active'
    ],
    outputs: [
        'onChange'
    ]
})
export class GalleryBulletsComponent {
    public count: number;
    public active: number = 0;

    onChange = new EventEmitter();

    getBullets(): number[] {
        return Array(this.count);
    }

    handleChange(_event: Event, index: number): void {
        this.onChange.emit(index);
    }
}
