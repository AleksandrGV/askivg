/**
 * ========== PRELOADER ==========
 * Загрузочный экран для сайта A.S.K.I.V.G.
 */

import { GLOBALS } from './constants.js';

// Флаг для предотвращения множественных запусков
let isInitialized = false;

// ========== PRELOADER (Загрузочный экран) ==========
export function initPreloader() {
    
    // Предотвращаем двойную инициализацию
    if (isInitialized) {
        return;
    }

    const preloader = document.getElementById('preloader');
    const progressLine = document.getElementById('progressLine');
    
    if (!preloader || !progressLine) {
        return;
    }

    isInitialized = true;
    
    // Удаляем класс no-js при работающем JavaScript
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js-enabled');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Задержка перед скрытием прелоадера
            setTimeout(() => {
                hidePreloader();
            }, 500);
        }
        
        progressLine.style.width = progress + '%';
    }, 100);
}

export function hidePreloader() {
    const preloader = document.getElementById('preloader');
    const body = document.body;
    
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            body.style.overflow = 'auto';
            GLOBALS.isPreloaderActive = false;
            
            // Запускаем AOS анимации после скрытия прелоадера
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 500);
    }
}

export default {
    initPreloader,
    hidePreloader
};