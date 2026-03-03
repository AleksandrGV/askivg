// // ============================================
// // ФАЙЛ 7: js/main.js (ФИНАЛЬНАЯ ВЕРСИЯ)
// // ============================================
// /**
//  * ========== MAIN SCRIPT FILE ==========
//  * Основной JavaScript файл для сайта A.S.K.I.V.G.
//  * Инициализация всех модулей с единым стандартом импортов
//  */

// // ========== ИМПОРТЫ МОДУЛЕЙ ==========
// // ВСЕ модули импортируются ЕДИНООБРАЗНО - через default экспорт

// // Утилиты
// import utils from './modules/utils.js';

// // Базовые модули сайта
// import preloader from './modules/preloader.js';
// import navigation from './modules/navigation.js';
// import smoothScroll from './modules/smooth-scroll.js';
// import animations from './modules/animations.js';
// import portfolio from './modules/portfolio.js';
// import technologies from './modules/technologies.js';
// import resizeEvents from './modules/resize-events.js';

// // Контактная форма (export default)
// import ContactForm from './modules/contact-form.js';

// // Модули отзывов и комментариев
// import comments from './modules/comments.js';
// import rating from './modules/rating.js';
// import captcha from './modules/captcha.js';
// import recentComments from './modules/recent-comments.js';
// import projects from './modules/projects.js';

// // Данные проектов
// import { PROJECT_DATA } from './modules/project-data.js';

// // ========== ГЛОБАЛЬНЫЙ MD5 ==========
// if (typeof md5 === 'undefined') {
//     // console.log('MD5 не найден, загружаем библиотеку...');
    
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js';
//     script.crossOrigin = 'anonymous';
    
//     script.onload = function() {
//         // console.log('✅ MD5 библиотека успешно загружена');

//         // После загрузки MD5 инициализируем модули
//         initAllModules();
//         // if (typeof recentComments?.loadRecentComments === 'function') {
//         //     recentComments.loadRecentComments(6);
//         // }
//     };
    
//     script.onerror = function() {
//         console.warn('⚠️ Не удалось загрузить MD5 библиотеку, используем fallback');
//         // window.md5 = utils.simpleMD5;
//         window.md5 = function(str) {
//             let hash = 0;
//             if (str.length === 0) return '00000000000000000000000000000000';
//             for (let i = 0; i < str.length; i++) {
//                 const char = str.charCodeAt(i);
//                 hash = ((hash << 5) - hash) + char;
//                 hash = hash & hash;
//             }
//             return Math.abs(hash).toString(16).padStart(32, '0');
//         };
//         // Всё равно инициализируем модули
//         initAllModules();
//     };
    
//     document.head.appendChild(script);
// } else {
//     // console.log('✅ MD5 уже загружен');
//     initAllModules();
// }

// // ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========

// /**
//  * Инициализация всех модулей
//  */
// async function initAllModules() {
//     try {
//         // console.log('🚀 Инициализация модулей...');
        
//         // 1. Инициализация базовых модулей
//         if (preloader?.initPreloader) preloader.initPreloader();
//         if (navigation?.initNavigation) navigation.initNavigation();
//         if (smoothScroll?.initSmoothScroll) smoothScroll.initSmoothScroll();
//         if (animations?.initAnimations) animations.initAnimations();
//         if (portfolio?.initPortfolio) portfolio.initPortfolio();
//         if (technologies?.initTechnologies) technologies.initTechnologies();
//         if (resizeEvents?.initResizeEvents) resizeEvents.initResizeEvents();
        
//         // 2. Инициализация контактной формы (класс)
//         if (typeof ContactForm !== 'undefined') {
//             new ContactForm();
//             // console.log('✅ Контактная форма инициализирована');
//         }
        
//         // 3. Делаем функции глобально доступными
//         window.openProjectModal = projects.openProjectModal;
//         window.closeProjectModal = projects.closeProjectModal;
//         window.refreshProjectCaptcha = captcha.refreshCaptcha;
//         window.md5 = window.md5 || utils.simpleMD5;
//         window.PROJECT_DATA = PROJECT_DATA;
        
//         // 4. Загружаем последние комментарии
//         // console.log('📝 Загрузка последних комментариев...');
        
//         if (typeof recentComments?.loadRecentComments === 'function') {
//             await recentComments.loadRecentComments(6);
//             // console.log('✅ Последние комментарии загружены');
//         }
        
//         // console.log('✅ Все модули успешно инициализированы');
        
//     } catch (error) {
//         console.error('❌ Ошибка при инициализации модулей:', error);
//     }
// }

// /**
//  * Основная функция
//  */
// function main() {
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', initAllModules);
//     } else {
//         initAllModules();
//     }
// }

// // Запуск
// main();

// // ========== ЭКСПОРТЫ ==========
// export default {
//     initAllModules,
//     main
// };

// ============================================
// ФАЙЛ 7: js/main.js (ИСПРАВЛЕННАЯ ВЕРСИЯ)
// ============================================
/**
 * ========== MAIN SCRIPT FILE ==========
 * Основной JavaScript файл для сайта A.S.K.I.V.G.
 * Инициализация всех модулей с единым стандартом импортов
 */

// ========== ИМПОРТЫ МОДУЛЕЙ ==========
import utils from './modules/utils.js';
import preloader from './modules/preloader.js';
import navigation from './modules/navigation.js';
import smoothScroll from './modules/smooth-scroll.js';
import animations from './modules/animations.js';
import portfolio from './modules/portfolio.js';
import technologies from './modules/technologies.js';
import resizeEvents from './modules/resize-events.js';
import ContactForm from './modules/contact-form.js';
import comments from './modules/comments.js';
import rating from './modules/rating.js';
import captcha from './modules/captcha.js';
import recentComments from './modules/recent-comments.js';
import projects from './modules/projects.js';
import { PROJECT_DATA } from './modules/project-data.js';

// ========== ФЛАГ ДЛЯ ПРЕДОТВРАЩЕНИЯ ДВОЙНОЙ ИНИЦИАЛИЗАЦИИ ==========
let isInitialized = false;

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
async function initAllModules() {
    // Если уже инициализировано - выходим
    if (isInitialized) {
        // console.log('⚠️ Модули уже инициализированы, пропускаем');
        return;
    }
    
    try {
        // console.log('🚀 Инициализация модулей...');
        
        // Устанавливаем флаг
        isInitialized = true;
        
        // 1. Инициализация базовых модулей
        if (preloader?.initPreloader) preloader.initPreloader();
        if (navigation?.initNavigation) navigation.initNavigation();
        if (smoothScroll?.initSmoothScroll) smoothScroll.initSmoothScroll();
        if (animations?.initAnimations) animations.initAnimations();
        if (portfolio?.initPortfolio) portfolio.initPortfolio();
        if (technologies?.initTechnologies) technologies.initTechnologies();
        if (resizeEvents?.initResizeEvents) resizeEvents.initResizeEvents();
        
        // 2. Инициализация контактной формы
        if (typeof ContactForm !== 'undefined') {
            new ContactForm();
        }
        
        // 3. Делаем функции глобально доступными
        window.openProjectModal = projects.openProjectModal;
        window.closeProjectModal = projects.closeProjectModal;
        window.refreshProjectCaptcha = captcha.refreshCaptcha;
        window.md5 = window.md5 || utils.simpleMD5;
        window.PROJECT_DATA = PROJECT_DATA;
        
        // 4. Загружаем последние комментарии
        if (typeof recentComments?.loadRecentComments === 'function') {
            await recentComments.loadRecentComments(6);
        }
        
        // console.log('✅ Все модули успешно инициализированы');
        
    } catch (error) {
        console.error('❌ Ошибка при инициализации модулей:', error);
    }
}

// ========== ЗАГРУЗКА MD5 И ЗАПУСК ==========
if (typeof md5 === 'undefined') {
    // console.log('MD5 не найден, загружаем библиотеку...');
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js';
    script.crossOrigin = 'anonymous';
    
    script.onload = function() {
        // console.log('✅ MD5 библиотека успешно загружена');
        // ТОЛЬКО ЗДЕСЬ инициализируем модули
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAllModules);
        } else {
            initAllModules();
        }
    };
    
    script.onerror = function() {
        console.warn('⚠️ Не удалось загрузить MD5 библиотеку, используем fallback');
        window.md5 = function(str) {
            let hash = 0;
            if (str.length === 0) return '00000000000000000000000000000000';
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16).padStart(32, '0');
        };
        // Инициализируем модули с fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAllModules);
        } else {
            initAllModules();
        }
    };
    
    document.head.appendChild(script);
} else {
    // console.log('✅ MD5 уже загружен');
    // Если MD5 уже есть - инициализируем сразу
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllModules);
    } else {
        initAllModules();
    }
}

// ========== ЭКСПОРТЫ ==========
export default {
    initAllModules
};