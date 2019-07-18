import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { InputConverter } from 'ontimize-web-ngx';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-action',
    templateUrl: './gallery-action.component.html',
    inputs: [
        'icon',
        'disabled',
        'titleText'
    ],
    outputs: [
        'onClick'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryActionComponent {
    public icon: string;
    @InputConverter()
    public disabled: boolean = false;
    public titleText: string = '';

    onClick: EventEmitter<Event> = new EventEmitter();

    handleClick(event: Event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }

        event.stopPropagation();
        event.preventDefault();
    }
}
