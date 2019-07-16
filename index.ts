import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { OCustomMaterialModule } from 'ontimize-web-ngx';

import { OGALLERY_DIRECTIVES } from './src/components';

export * from './src/interfaces';
export * from './src/services';
export * from './src/models';
export * from './src/components';

export class CustomHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        'pinch': { enable: false },
        'rotate': { enable: false }
    };
}

@NgModule({
    imports: [
        CommonModule,
        OCustomMaterialModule
    ],
    declarations: [ OGALLERY_DIRECTIVES ],
    exports: [ OGALLERY_DIRECTIVES ],
    providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }]
})
export class OGalleryModule { }
