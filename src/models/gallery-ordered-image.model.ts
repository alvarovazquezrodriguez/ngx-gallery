import { SafeResourceUrl } from '@angular/platform-browser';
import { IGalleryOrderedImage } from '../interfaces/IGalleryOrderedImage';

export class GalleryOrderedImage implements IGalleryOrderedImage {
    src: string | SafeResourceUrl;
    type: string;
    index: number;

    constructor(obj: IGalleryOrderedImage) {
        this.src = obj.src;
        this.type = obj.type;
        this.index = obj.index;
    }
}
