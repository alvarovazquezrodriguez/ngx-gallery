import { GalleryAnimation } from './gallery-animation.model';
import { GalleryImageSize } from './gallery-image-size.model';
import { GalleryLayout } from './gallery-layout.model';
import { GalleryOrder } from './gallery-order.model';
import { GalleryAction } from './gallery-action.model';

import { IGalleryOptions } from '../interfaces/IGalleryOptions';

export class GalleryOptions implements IGalleryOptions {
    width?: string;
    height?: string;
    breakpoint?: number;
    fullWidth?: boolean;
    layout?: string;
    startIndex?: number;
    linkTarget?: string;
    lazyLoading?: boolean;
    image?: boolean;
    imagePercent?: number;
    imageArrows?: boolean;
    imageArrowsAutoHide?: boolean;
    imageSwipe?: boolean;
    imageAnimation?: string;
    imageSize?: string;
    imageAutoPlay?: boolean;
    imageAutoPlayInterval?: number;
    imageAutoPlayPauseOnHover?: boolean;
    imageInfinityMove?: boolean;
    imageActions?: GalleryAction[];
    imageDescription?: boolean;
    imageBullets?: boolean;
    thumbnails?: boolean;
    thumbnailsColumns?: number;
    thumbnailsRows?: number;
    thumbnailsPercent?: number;
    thumbnailsMargin?: number;
    thumbnailsArrows?: boolean;
    thumbnailsArrowsAutoHide?: boolean;
    thumbnailsSwipe?: boolean;
    thumbnailsMoveSize?: number;
    thumbnailsOrder?: GalleryOrder;
    thumbnailsRemainingCount?: boolean;
    thumbnailsAsLinks?: boolean;
    thumbnailsAutoHide?: boolean;
    thumbnailMargin?: number;
    thumbnailSize?: string;
    thumbnailActions?: GalleryAction[];
    preview?: boolean;
    previewDescription?: boolean;
    previewArrows?: boolean;
    previewArrowsAutoHide?: boolean;
    previewSwipe?: boolean;
    previewFullscreen?: boolean;
    previewForceFullscreen?: boolean;
    previewCloseOnClick?: boolean;
    previewCloseOnEsc?: boolean;
    previewKeyboardNavigation?: boolean;
    previewAnimation?: boolean;
    previewAutoPlay?: boolean;
    previewAutoPlayInterval?: number;
    previewAutoPlayPauseOnHover?: boolean;
    previewInfinityMove?: boolean;
    previewZoom?: boolean;
    previewZoomStep?: number;
    previewZoomMax?: number;
    previewZoomMin?: number;
    previewRotate?: boolean;
    previewDownload?: boolean;
    previewCustom?: (index: number) => void;
    previewBullets?: boolean;
    arrowPrevIcon?: string;
    arrowNextIcon?: string;
    closeIcon?: string;
    fullscreenIcon?: string;
    spinnerIcon?: string;
    zoomInIcon?: string;
    zoomOutIcon?: string;
    rotateLeftIcon?: string;
    rotateRightIcon?: string;
    downloadIcon?: string;
    actions?: GalleryAction[];

    constructor(obj: IGalleryOptions) {

        const preventDefaults = obj.breakpoint === undefined ? false : true;

        function use<T>(source: T, defaultValue: T): T {
            return obj && (source !== undefined || preventDefaults) ? source : defaultValue;
        }

        this.breakpoint = use(obj.breakpoint, undefined);
        this.width = use(obj.width, '500px');
        this.height = use(obj.height, '400px');
        this.fullWidth = use(obj.fullWidth, false);
        this.layout = use(obj.layout, GalleryLayout.ThumbnailsBottom);
        this.startIndex = use(obj.startIndex, 0);
        this.linkTarget = use(obj.linkTarget, '_blank');
        this.lazyLoading = use(obj.lazyLoading, true);

        this.image = use(obj.image, true);
        this.imagePercent = use(obj.imagePercent, 75);
        this.imageArrows = use(obj.imageArrows, true);
        this.imageArrowsAutoHide = use(obj.imageArrowsAutoHide, false);
        this.imageSwipe = use(obj.imageSwipe, false);
        this.imageAnimation = use(obj.imageAnimation, GalleryAnimation.Fade);
        this.imageSize = use(obj.imageSize, GalleryImageSize.Cover);
        this.imageAutoPlay = use(obj.imageAutoPlay, false);
        this.imageAutoPlayInterval = use(obj.imageAutoPlayInterval, 2000);
        this.imageAutoPlayPauseOnHover = use(obj.imageAutoPlayPauseOnHover, false);
        this.imageInfinityMove = use(obj.imageInfinityMove, false);
        if (obj && obj.imageActions && obj.imageActions.length) {
            obj.imageActions = obj.imageActions.map(action => new GalleryAction(action));
        }
        this.imageActions = use(obj.imageActions, []);
        this.imageDescription = use(obj.imageDescription, false);
        this.imageBullets = use(obj.imageBullets, false);

        this.thumbnails = use(obj.thumbnails, true);
        this.thumbnailsColumns = use(obj.thumbnailsColumns, 4);
        this.thumbnailsRows = use(obj.thumbnailsRows, 1);
        this.thumbnailsPercent = use(obj.thumbnailsPercent, 25);
        this.thumbnailsMargin = use(obj.thumbnailsMargin, 10);
        this.thumbnailsArrows = use(obj.thumbnailsArrows, true);
        this.thumbnailsArrowsAutoHide = use(obj.thumbnailsArrowsAutoHide, false);
        this.thumbnailsSwipe = use(obj.thumbnailsSwipe, false);
        this.thumbnailsMoveSize = use(obj.thumbnailsMoveSize, 1);
        this.thumbnailsOrder = use(obj.thumbnailsOrder, GalleryOrder.Column);
        this.thumbnailsRemainingCount = use(obj.thumbnailsRemainingCount, false);
        this.thumbnailsAsLinks = use(obj.thumbnailsAsLinks, false);
        this.thumbnailsAutoHide = use(obj.thumbnailsAutoHide, false);
        this.thumbnailMargin = use(obj.thumbnailMargin, 10);
        this.thumbnailSize = use(obj.thumbnailSize, GalleryImageSize.Cover);
        if (obj && obj.thumbnailActions && obj.thumbnailActions.length) {
            obj.thumbnailActions = obj.thumbnailActions.map(action => new GalleryAction(action));
        }
        this.thumbnailActions = use(obj.thumbnailActions, []);

        this.preview = use(obj.preview, true);
        this.previewDescription = use(obj.previewDescription, true);
        this.previewArrows = use(obj.previewArrows, true);
        this.previewArrowsAutoHide = use(obj.previewArrowsAutoHide, false);
        this.previewSwipe = use(obj.previewSwipe, false);
        this.previewFullscreen = use(obj.previewFullscreen, true);
        this.previewForceFullscreen = use(obj.previewForceFullscreen, false);
        this.previewCloseOnClick = use(obj.previewCloseOnClick, false);
        this.previewCloseOnEsc = use(obj.previewCloseOnEsc, false);
        this.previewKeyboardNavigation = use(obj.previewKeyboardNavigation, false);
        this.previewAnimation = use(obj.previewAnimation, true);
        this.previewAutoPlay = use(obj.previewAutoPlay, false);
        this.previewAutoPlayInterval = use(obj.previewAutoPlayInterval, 2000);
        this.previewAutoPlayPauseOnHover = use(obj.previewAutoPlayPauseOnHover, false);
        this.previewInfinityMove = use(obj.previewInfinityMove, false);
        this.previewZoom = use(obj.previewZoom, true);
        this.previewZoomStep = use(obj.previewZoomStep, 0.1);
        this.previewZoomMax = use(obj.previewZoomMax, 2);
        this.previewZoomMin = use(obj.previewZoomMin, 0.5);
        this.previewRotate = use(obj.previewRotate, true);
        this.previewDownload = use(obj.previewDownload, false);
        this.previewCustom = use(obj.previewCustom, undefined);
        this.previewBullets = use(obj.previewBullets, false);

        this.arrowPrevIcon = use(obj.arrowPrevIcon, 'undo');
        this.arrowNextIcon = use(obj.arrowNextIcon, 'redo');
        this.closeIcon = use(obj.closeIcon, 'close');
        this.fullscreenIcon = use(obj.fullscreenIcon, 'fullscreen');
        this.spinnerIcon = use(obj.spinnerIcon, 'loop');
        this.zoomInIcon = use(obj.zoomInIcon, 'zoom_in');
        this.zoomOutIcon = use(obj.zoomOutIcon, 'zoom_out');
        this.rotateLeftIcon = use(obj.rotateLeftIcon, 'rotate_left');
        this.rotateRightIcon = use(obj.rotateRightIcon, 'rotate_right');
        this.downloadIcon = use(obj.downloadIcon, 'save');

        if (obj && obj.actions && obj.actions.length) {
            obj.actions = obj.actions.map(action => new GalleryAction(action));
        }
        this.actions = use(obj.actions, []);
    }
}
