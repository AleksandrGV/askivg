/**
 * ========== CONSTANTS AND DATA ==========
 * Константы и данные для сайта A.S.K.I.V.G.
 */

// Глобальные переменные
export const GLOBALS = {
    isPreloaderActive: true,
    currentFilter: '*',
    mediaQuery: {
        desktop: window.matchMedia('(min-width: 480px)'),
        mobile: window.matchMedia('(max-width: 479px)')
    }
};

export const TECHNOLOGIES_DATA = {
    html: { 
        title: 'HTML5', 
        text: 'Семантическая разметка по современным стандартам.' 
    },
    css: { 
        title: 'CSS3', 
        text: 'Grid, Flexbox, анимации и адаптивный дизайн.' 
    },
    js: { 
        title: 'JavaScript ES6+', 
        text: 'Современный JavaScript для веб-приложений.' 
    },
    wordpress: { 
        title: 'WordPress', 
        text: 'Кастомные темы и плагины любой сложности.' 
    },
    git: { 
        title: 'Git', 
        text: 'Контроль версий для командной работы.' 
    },
    webpack: { 
        title: 'Webpack', 
        text: 'Сборка и оптимизация фронтенд-ресурсов.' 
    },
    figma: { 
        title: 'Figma', 
        text: 'Проектирование интерфейсов и прототипирование.' 
    },
    tilda: { 
        title: 'Tilda Publishing', 
        text: 'Быстрое создание стильных лендингов.' 
    },
    bem: { 
        title: 'БЭМ', 
        text: 'Методология для масштабируемого CSS.' 
    },
    sass: { 
        title: 'Sass/SCSS', 
        text: 'Препроцессор CSS для эффективной разработки.' 
    }
};

// Экспорт всех констант
export default {
    GLOBALS,
    TECHNOLOGIES_DATA
};