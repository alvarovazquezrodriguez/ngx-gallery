import { SafeResourceUrl } from '@angular/platform-browser';

export interface IGalleryImage {
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    type?: string;
    label?: string;
}
