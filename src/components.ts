import { GalleryActionComponent } from './components/gallery-action/gallery-action.component';
import { GalleryArrowsComponent } from './components/gallery-arrows/gallery-arrows.component';
import { GalleryBulletsComponent } from './components/gallery-bullets/gallery-bullets.component';
import { GalleryImageComponent } from './components/gallery-image/gallery-image.component';
import { GalleryThumbnailsComponent } from './components/gallery-thumbnails/gallery-thumbnails.component';
import { GalleryPreviewComponent } from './components/gallery-preview/gallery-preview.component';
import { GalleryComponent } from './components/gallery/gallery.component';

export * from './components/gallery/gallery.component';
export * from './components/gallery-action/gallery-action.component';
export * from './components/gallery-image/gallery-image.component';
export * from './components/gallery-thumbnails/gallery-thumbnails.component';
export * from './components/gallery-preview/gallery-preview.component';
export * from './components/gallery-arrows/gallery-arrows.component';
export * from './components/gallery-bullets/gallery-bullets.component';

export const OGALLERY_DIRECTIVES: any[] = [
    GalleryActionComponent,
    GalleryArrowsComponent,
    GalleryBulletsComponent,
    GalleryImageComponent,
    GalleryThumbnailsComponent,
    GalleryPreviewComponent,
    GalleryComponent
];
