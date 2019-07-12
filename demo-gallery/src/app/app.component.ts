import { Component, OnInit } from '@angular/core';
import { GalleryOptions, GalleryImage, GalleryAnimation } from 'ontimize-web-ngx-gallery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    title = 'Galeria';
    galleryOptions: GalleryOptions[];
    galleryImages: GalleryImage[];

    ngOnInit(): void {

        this.galleryOptions = [
            {
                width: '600px',
                height: '400px',
                thumbnailsColumns: 4,
                imageAnimation: GalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

        this.galleryImages = [
            {
                small: '../assets/photo1.jpg',
                medium: '../assets/photo1.jpg',
                big: '../assets/photo1.jpg'
            },
            {
                small: '../assets/photo2.jpg',
                medium: '../assets/photo2.jpg',
                big: '../assets/photo2.jpg'
            },
            {
                small: '../assets/photo3.jpg',
                medium: '../assets/photo3.jpg',
                big: '../assets/photo3.jpg'
            }
        ];
    }
}
