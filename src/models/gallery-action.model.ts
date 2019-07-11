import { IGalleryAction } from '../interfaces/IGalleryAction';

export class GalleryAction implements IGalleryAction {
    icon: string;
    disabled?: boolean;
    titleText?: string;

    onClick: (event: Event, index: number) => void;

    constructor(action: IGalleryAction) {
        this.icon = action.icon;
        this.disabled = action.disabled ? action.disabled : false;
        this.titleText = action.titleText ? action.titleText : '';

        this.onClick = action.onClick;
    }
}
