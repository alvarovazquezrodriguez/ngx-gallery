export interface IGalleryAction {
    icon: string;
    disabled?: boolean;
    titleText?: string;

    onClick: (event: Event, index: number) => void;
}
