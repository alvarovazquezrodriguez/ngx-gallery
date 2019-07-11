import { SafeResourceUrl } from '@angular/platform-browser';

export interface IGalleryOrderedImage {
    src: string | SafeResourceUrl;
    type: string;
    index: number;
}
