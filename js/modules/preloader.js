import { CONFIG } from './config.js';

export class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressLine = document.getElementById('progressLine');
    }

    init() {
        if (!this.preloader || !this.progressLine) {return;}
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    this.hide();
                }, 500);
            }
            
            this.progressLine.style.width = progress + '%';
        }, 100);
    }

    hide() {
        const body = document.body;
        
        if (this.preloader) {
            this.preloader.classList.add('hidden');
            setTimeout(() => {
                this.preloader.style.display = 'none';
                body.style.overflow = 'auto';
                CONFIG.isPreloaderActive = false;
                
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 500);
        }
    }
}
