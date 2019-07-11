import { SafeResourceUrl } from '@angular/platform-browser';
import { IGalleryImage } from '../interfaces/IGalleryImage';

export class GalleryImage implements IGalleryImage {
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    type?: string;
    label?: string;

    constructor(obj: IGalleryImage) {
        this.small = obj.small;
        this.medium = obj.medium;
        this.big = obj.big;
        this.description = obj.description;
        this.url = obj.url;
        this.type = obj.type;
        this.label = obj.label;
    }
}
