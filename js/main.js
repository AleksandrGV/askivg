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
// import utils from './modules/utils.js';
// import preloader from './modules/preloader.js';
// import navigation from './modules/navigation.js';
// import smoothScroll from './modules/smooth-scroll.js';
// import animations from './modules/animations.js';
// import portfolio from './modules/portfolio.js';
// import technologies from './modules/technologies.js';
// import resizeEvents from './modules/resize-events.js';
// import ContactForm from './modules/contact-form.js';
// // import comments from './modules/comments.js';
// // import rating from './modules/rating.js';
// import captcha from './modules/captcha.js';
// import recentComments from './modules/recent-comments.js';
// import projects from './modules/projects.js';
// import { PROJECT_DATA } from './modules/project-data.js';

// // ========== ФЛАГ ДЛЯ ПРЕДОТВРАЩЕНИЯ ДВОЙНОЙ ИНИЦИАЛИЗАЦИИ ==========
// let isInitialized = false;

// // ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
// async function initAllModules() {
//     // Если уже инициализировано - выходим
//     if (isInitialized) {
//         // console.log('⚠️ Модули уже инициализированы, пропускаем');
//         return;
//     }
    
//     try {
//         // console.log('🚀 Инициализация модулей...');
        
//         // Устанавливаем флаг
//         isInitialized = true;
        
//         // 1. Инициализация базовых модулей
//         if (preloader?.initPreloader) {
//             preloader.initPreloader();
//         }
//         if (navigation?.initNavigation) {
//             navigation.initNavigation();
//         }
//         if (smoothScroll?.initSmoothScroll) {
//             smoothScroll.initSmoothScroll();
//         }
//         if (animations?.initAnimations) {
//             animations.initAnimations();
//         }
//         if (portfolio?.initPortfolio) {
//             portfolio.initPortfolio();
//         }
//         if (technologies?.initTechnologies) {
//             technologies.initTechnologies();
//         }
//         if (resizeEvents?.initResizeEvents) {
//             resizeEvents.initResizeEvents();
//         }
        
//         // 2. Инициализация контактной формы
//         if (typeof ContactForm !== 'undefined') {
//             new ContactForm();
//         }
        
//         // 3. Делаем функции глобально доступными
//         window.openProjectModal = projects.openProjectModal;
//         window.closeProjectModal = projects.closeProjectModal;
//         window.refreshProjectCaptcha = captcha.refreshCaptcha;
//         window.md5 = window.md5 || utils.simpleMD5;
//         window.PROJECT_DATA = PROJECT_DATA;
        
//         // 4. Загружаем последние комментарии
//         if (typeof recentComments?.loadRecentComments === 'function') {
//             await recentComments.loadRecentComments(6);
//         }
        
//         // console.log('✅ Все модули успешно инициализированы');
        
//     } catch (error) {
//         console.error('❌ Ошибка при инициализации модулей:', error);
//     }
// }

// // После инициализации всех модулей
// if (typeof projects.initPortfolioHandlers === 'function') {
//     projects.initPortfolioHandlers();
// }

// // ========== ДЕЛЕГИРОВАННЫЙ ОБРАБОТЧИК ДЛЯ КНОПОК ПОРТФОЛИО ==========
// // Добавляем один обработчик на всё тело документа
// document.body.addEventListener('click', function(e) {
//     // Ищем кнопку с атрибутом data-project-slug
//     const btn = e.target.closest('[data-project-slug]');
//     if (!btn) return;
    
//     const slug = btn.getAttribute('data-project-slug');
//     if (slug && typeof window.openProjectModal === 'function') {
//         e.preventDefault();
//         e.stopPropagation();
//         window.openProjectModal(slug);
//     }
// });

// // Также обрабатываем старые кнопки с onclick (временно, для обратной совместимости)
// document.querySelectorAll('[onclick*="openProjectModal"]').forEach(btn => {
//     // Сохраняем оригинальный onclick для извлечения слага
//     const onclickAttr = btn.getAttribute('onclick');
//     const match = onclickAttr?.match(/openProjectModal\(['"]([^'"]+)['"]\)/);
//     if (match && match[1]) {
//         // Заменяем onclick на data-атрибут
//         btn.setAttribute('data-project-slug', match[1]);
//         btn.removeAttribute('onclick');
//     }
// });

// console.log('✅ Делегированный обработчик для портфолио установлен');

// // ========== ЕДИНЫЙ ОБРАБОТЧИК ДЛЯ ВСЕХ КНОПОК ПОРТФОЛИО ==========
// // Удаляем все существующие onclick атрибуты и заменяем их делегированием
// function initGlobalModalHandler() {
//     // Находим контейнер портфолио
//     const portfolioGrid = document.querySelector('.portfolio__grid');
//     if (!portfolioGrid) {
//         return;
//     }
    
//     // Используем делегирование - ОДИН обработчик на весь контейнер
//     portfolioGrid.addEventListener('click', function(e) {
//         // Ищем кнопку, которая содержит onclick с openProjectModal
//         const btn = e.target.closest('[onclick*="openProjectModal"]');
//         if (!btn) {
//             return;
//         }
        
//         e.preventDefault();
//         e.stopPropagation();
        
//         // Извлекаем слаг из onclick
//         const onclickAttr = btn.getAttribute('onclick');
//         const match = onclickAttr.match(/openProjectModal\(['"]([^'"]+)['"]\)/);
        
//         if (match && match[1] && typeof window.openProjectModal === 'function') {
//             window.openProjectModal(match[1]);
//         }
//     });
    
//     // Удаляем оригинальные onclick атрибуты, чтобы они не мешали
//     document.querySelectorAll('[onclick*="openProjectModal"]').forEach(btn => {
//         btn.removeAttribute('onclick');
//     });
// }

// // Вызовите после инициализации модулей
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initGlobalModalHandler);
// } else {
//     initGlobalModalHandler();
// }

// // ========== ЗАГРУЗКА MD5 И ЗАПУСК ==========
// if (typeof md5 === 'undefined') {
//     // console.log('MD5 не найден, загружаем библиотеку...');
    
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js';
//     script.crossOrigin = 'anonymous';
    
//     script.onload = function() {
//         // console.log('✅ MD5 библиотека успешно загружена');
//         // ТОЛЬКО ЗДЕСЬ инициализируем модули
//         if (document.readyState === 'loading') {
//             document.addEventListener('DOMContentLoaded', initAllModules);
//         } else {
//             initAllModules();
//         }
//     };
    
//     script.onerror = function() {
//         console.warn('⚠️ Не удалось загрузить MD5 библиотеку, используем fallback');
//         window.md5 = function(str) {
//             let hash = 0;
//             if (str.length === 0) {
//                 return '00000000000000000000000000000000';
//             }
//             for (let i = 0; i < str.length; i++) {
//                 const char = str.charCodeAt(i);
//                 hash = ((hash << 5) - hash) + char;
//                 hash = hash & hash;
//             }
//             return Math.abs(hash).toString(16).padStart(32, '0');
//         };
//         // Инициализируем модули с fallback
//         if (document.readyState === 'loading') {
//             document.addEventListener('DOMContentLoaded', initAllModules);
//         } else {
//             initAllModules();
//         }
//     };
    
//     document.head.appendChild(script);
// } else {
//     // console.log('✅ MD5 уже загружен');
//     // Если MD5 уже есть - инициализируем сразу
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', initAllModules);
//     } else {
//         initAllModules();
//     }
// }

// // ========== ЭКСПОРТЫ ==========
// export default {
//     initAllModules
// };

// ============================================
// ФАЙЛ 7: js/main.js (ОКОНЧАТЕЛЬНАЯ ВЕРСИЯ)
// ============================================

import utils from './modules/utils.js';
import preloader from './modules/preloader.js';
import navigation from './modules/navigation.js';
import smoothScroll from './modules/smooth-scroll.js';
import animations from './modules/animations.js';
import portfolio from './modules/portfolio.js';
import technologies from './modules/technologies.js';
import resizeEvents from './modules/resize-events.js';
import ContactForm from './modules/contact-form.js';
import captcha from './modules/captcha.js';
import recentComments from './modules/recent-comments.js';
import projects from './modules/projects.js';
import { PROJECT_DATA } from './modules/project-data.js';

let isInitialized = false;

// ========== ЕДИНСТВЕННЫЙ ДЕЛЕГИРОВАННЫЙ ОБРАБОТЧИК ==========
// ВАЖНО: Добавляем только ОДИН раз, используем флаг
let isHandlerAttached = false;

function setupDelegatedHandler() {
    if (isHandlerAttached) {
        return;
    }
    isHandlerAttached = true;
    
    // Один обработчик на всё тело документа
    document.body.addEventListener('click', function(e) {
        // Ищем кнопку с data-project-slug (новый способ)
        let btn = e.target.closest('[data-project-slug]');
        
        // Если не нашли, ищем кнопку с onclick (старый способ, временно)
        if (!btn) {
            btn = e.target.closest('[onclick*="openProjectModal"]');
        }
        
        // Если не нашли кнопку портфолио, выходим
        if (!btn) {
            return;
        }
        
        // Получаем слаг проекта
        let slug = btn.getAttribute('data-project-slug');
        
        if (!slug) {
            // Извлекаем из onclick атрибута
            const onclickAttr = btn.getAttribute('onclick');
            const match = onclickAttr?.match(/openProjectModal\(['"]([^'"]+)['"]\)/);
            if (match && match[1]) {
                slug = match[1];
                // Обновляем атрибут для будущих кликов
                btn.setAttribute('data-project-slug', slug);
                btn.removeAttribute('onclick');
            }
        }
        
        if (slug && typeof window.openProjectModal === 'function') {
            e.preventDefault();
            e.stopPropagation();
            window.openProjectModal(slug);
        }
    });
    
    // Удаляем все существующие onclick атрибуты у кнопок портфолио
    document.querySelectorAll('.portfolio__item [onclick*="openProjectModal"]').forEach(btn => {
        const slug = btn.getAttribute('onclick')?.match(/openProjectModal\(['"]([^'"]+)['"]\)/)?.[1];
        if (slug) {
            btn.setAttribute('data-project-slug', slug);
            btn.removeAttribute('onclick');
        }
    });
    
    console.log('✅ Делегированный обработчик установлен (один раз)');
}

// ========== ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ==========
async function initAllModules() {
    if (isInitialized) {
        return;
    }
    isInitialized = true;
    
    try {
        // 1. Базовые модули
        if (preloader?.initPreloader) {
            preloader.initPreloader();
        }
        if (navigation?.initNavigation) {
            navigation.initNavigation();
        }
        if (smoothScroll?.initSmoothScroll) {
            smoothScroll.initSmoothScroll();
        }
        if (animations?.initAnimations) {
            animations.initAnimations();
        }
        if (portfolio?.initPortfolio) {
            portfolio.initPortfolio();
        }
        if (technologies?.initTechnologies) {
            technologies.initTechnologies();
        }
        if (resizeEvents?.initResizeEvents) {
            resizeEvents.initResizeEvents();
        }
        
        // 2. Контактная форма
        if (typeof ContactForm !== 'undefined') {
            new ContactForm();
        }
        
        // 3. Глобальные функции
        window.openProjectModal = projects.openProjectModal;
        window.closeProjectModal = projects.closeProjectModal;
        window.refreshProjectCaptcha = captcha.refreshCaptcha;
        window.md5 = window.md5 || utils.simpleMD5;
        window.PROJECT_DATA = PROJECT_DATA;
        
        // 4. ЕДИНСТВЕННЫЙ обработчик (вызываем один раз)
        setupDelegatedHandler();
        
        // 5. Загружаем последние комментарии
        if (typeof recentComments?.loadRecentComments === 'function') {
            await recentComments.loadRecentComments(6);
        }
        
        console.log('✅ Все модули инициализированы');
        
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
    }
}

// ========== ЗАГРУЗКА MD5 ==========
if (typeof md5 === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAllModules);
        } else {
            initAllModules();
        }
    };
    script.onerror = () => {
        console.warn('⚠️ MD5 не загружен, используем fallback');
        window.md5 = (str) => {
            let hash = 0;
            if (!str) {
                return '00000000000000000000000000000000';
            }
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16).padStart(32, '0');
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAllModules);
        } else {
            initAllModules();
        }
    };
    document.head.appendChild(script);
} else {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllModules);
    } else {
        initAllModules();
    }
}

export default { initAllModules };