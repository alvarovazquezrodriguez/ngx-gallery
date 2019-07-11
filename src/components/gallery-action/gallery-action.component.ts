import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'o-gallery-action',
    templateUrl: './gallery-action.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryActionComponent {
    @Input() icon: string;
    @Input() disabled = false;
    @Input() titleText = '';

    @Output() onClick: EventEmitter<Event> = new EventEmitter();

    handleClick(event: Event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }

        event.stopPropagation();
        event.preventDefault();
    }
}
