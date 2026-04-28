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
        // if (!btn) {
        //     btn = e.target.closest('[onclick*="openProjectModal"]');
        // }
        
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
    
    // console.log('✅ Делегированный обработчик установлен (один раз)');
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
        
        // console.log('✅ Все модули инициализированы');
        
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