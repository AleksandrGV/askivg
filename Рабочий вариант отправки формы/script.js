/**
 * ========== MAIN SCRIPT FILE ==========
 * Основной JavaScript файл для сайта A.S.K.V.G.
 * Включает в себя все интерактивные элементы и анимации
 */

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let isPreloaderActive = true;
let testimonialSwiper = null;
let currentFilter = '*';

// Данные проектов для модальных окон
const projectData = {
    1: {
        title: 'Stage Studio',
        category: 'WordPress • Многостраничный корпоративный сайт',
        description: 'Создали уютный и функциональный сайт для студии танцев и видеографов с онлайн-заказом, системой лояльности и интеграцией с соцсетями.',
        technologies: ['WordPress', 'PHP', 'CSS3', 'JavaScript', 'MySQL'],
        duration: '2 месяца',
        images: [
            'img/stage-studio.jpg',
            'img/stage-studio-1.jpg',
            'img/stage-studio-2.jpg'
        ],
        liveUrl: 'https://stagestudio.ru/'
    },
    2: {
        title: 'Кексобукинг',
        category: 'HTML/CSS/JS • Одностраничный сайт',
        description: 'Современный сайт по подбору и размещению объявлений, по аренде жилья.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'БЭМ'],
        duration: '2 месяца',
        images: [
            'img/keksobooking.jpg',
            'img/keksobooking-1.jpg',
            'img/keksobooking-2.jpg'
        ],
        liveUrl: 'https://aleksandrgv.github.io/356085-keksobooking-21/'
    },
    3: {
        title: 'Мобильное приложение, которое раскрасит ваши серые будни розовыми красками',
        category: 'HTML/CSS/JS • Многостраничный сайд',
        description: 'Стильный многостраничный сайт о мобильном приложении, которое раскрасит ваши серые будни розовыми красками.',
        technologies: ['HTML', 'CSS', 'JS'],
        duration: '6 недель',
        images: [
            'img/pink-3.jpg',
            'img/pink-1.jpg',
            'img/pink-2.jpg',
            'img/pink.jpg'
        ],
        liveUrl: 'https://aleksandrgv.github.io/356085-pink-20/build/index.html'
    },
    4: {
        title: 'Стильное приглашение на свадьбу',
        category: 'Tilda • Одностраничный сайт',
        description: 'Стильный сайт пригласительное на свадьбу с таймером обратного отстчета и выбором напитков.',
        technologies: ['Tilda'],
        duration: '1 неделя',
        images: [
            'img/wedding-invitation-1.jpg',
            'img/wedding-invitation-2.jpg',
            'img/wedding-invitation-3.jpg'
        ],
        liveUrl: 'https://project7847501.tilda.ws/'
    },
    5: {
        title: 'Интернет-магазин строительных материалов и инструментов для ремонта.',
        category: 'HTML/CSS/JS • Многостраничный сайт.',
        description: 'Интернет-магазин строительных материалов и инструментов для ремонта.',
        technologies: ['HTML', 'CSS', 'JS'],
        duration: '1 месяц',
        images: [
            'img/technomart.jpg',
            'img/technomart-1.jpg',
            'img/technomart-catalog.jpg'
        ],
        liveUrl: 'proekty/technomart/index.html'
    },
    6: {
        title: 'Интернет магазин электронных гаджетов и акссесуаров.',
        category: 'HTML/CSS • Одностраничный сайт.',
        description: 'Магазин электронных гаджетов и акссесуаров, сайт с фиксированой версткой.',
        technologies: ['HTML', 'CSS'],
        duration: '2 недели',
        images: [
            'img/device.jpg',
            'img/device-1.jpg',
            'img/device-2.jpg'
        ],
        liveUrl: 'https://aleksandrgv.github.io/356085-device-28/'
    },
    7: {
        title: 'Услуги грузового транспорта',
        category: 'HTML/CSS/JS/Bootstrap/JQuery • Многостраничный сайт',
        description: 'Корпоративный сайт по предоставлению услуг по грузоперевозкам, а также предоставлению грузвого транспорта в аренду.',
        technologies: ['HTML', 'CSS', 'JS', 'Bootstrap', 'JQuery'],
        duration: '1,5 месяца',
        images: [
            'img/tractorbuilding1.jpg',
            'img/tractorbuilding-mobile.jpg',
            'img/tractorbuilding-mobile-1.jpg'
        ],
        liveUrl: 'proekty/tractorbuilding/index.html'
    },
    8: {
        title: 'Союз гаражных кооперативов',
        category: 'HTML/CSS/JS/Bootstrap/JQuery • Многостраничный сайт.',
        description: 'Корпоративный многостраничный сайт Союз гаражных кооперативов..',
        technologies: ['HTML', 'CSS', 'JS', 'Bootstrap', 'JQuery'],
        duration: '2,5 месяца',
        images: [
            'img/sgk.jpg',
            'img/sgk-1.jpg',
            'img/sgk-2.jpg',
            'img/sgk-3.jpg'
        ],
        liveUrl: 'proekty/gsk/index.html'
    },
    9: {
        title: 'My Corporate Website"',
        category: 'HTML/CSS • Корпоративный сайт',
        description: 'Простой корпоративный сайт с фиксированный версткой.',
        technologies: ['HTML5', 'CSS3'],
        duration: '2 недели',
        images: [
            'img/My_Corporate_Website.jpg',
            'img/My_Corp_Website.jpg'
        ],
        liveUrl: 'proekty/home/index.html'
    },
    10: {
        title: 'The Bike Shop"',
        category: 'HTML/CSS/JS/Bootstrap/JQuery • Многостраничный сайт',
        description: 'Корпоративный сайт и интернет магазин по продаже велосипедов ручной работы.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'JQuery', 'Bootstrap', 'Jquery'],
        duration: '1 месяц',
        images: [
            'img/thebikeshop.jpg',
            'img/thebikeshop-mobile.jpg',
            'img/thebikeshop-mobile-1.jpg'
        ],
        liveUrl: 'proekty/bikeshop/index.html'
    },
    11: {
        title: 'Банк "ЮниКредитБанк"',
        category: 'HTML/CSS/JS • Корпоративный сайт',
        description: 'Корпоративный сайт финансовой организации, банк "ЮниКредитБанк", фиксированная верстка.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'JQuery'],
        duration: '1,5 месяца',
        images: [
            'img/UniCreditBank.jpg',
            'img/UniCreditBank-1.jpg',
            'img/UniCreditBank-2.jpg'
        ],
        liveUrl: 'proekty/ukb/index.html'
    }
};

// ========== Медиа запросы ================
const mediaQuery = {
    desktop: window.matchMedia('(min-width: 480px)'),
    mobile: window.matchMedia('(max-width: 479px)'),
};

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 A.S.K.I.V.G. Website Loaded');
    
    // Инициализация всех компонентов
    initPreloader();
    initNavigation();
    initAOS();
    // initTechnologiesSphere();
    initPortfolioFilters();
    initTestimonialSlider();
    initContactForm();
    initSmoothScroll();
    
    // Обработчики событий
    handleScrollEffects();
    handleResizeEvents();

    // initTestimonialForm();
    loadRecentComments(6); // Загружаем 6 последних комментариев
});

// ========== PRELOADER (Загрузочный экран) ==========
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressLine = document.getElementById('progressLine');
    
    if (!preloader || !progressLine) return;
    
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

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    const body = document.body;
    
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            body.style.overflow = 'auto';
            isPreloaderActive = false;
            
            // Запускаем AOS анимации после скрытия прелоадера
            AOS.refresh();
        }, 500);
    }
}

// ========== NAVIGATION (Навигация) ==========
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    const nav = document.querySelector('.nav');
    
    // Мобильное меню
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // Закрытие мобильного меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navList?.classList.remove('active');
        });
    });
    
    // Изменение навигации при скролле
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (nav) {
            if (scrollTop > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Активная ссылка при скролле
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========== AOS INITIALIZATION (Инициализация анимаций) ==========
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 100
        });
        
        console.log('✨ AOS animations initialized');
    }
}

// ========== TECHNOLOGIES SPHERE (3D сфера технологий) ==========
//Описание технологий
const technologiesData = {
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
    },
}

// class в js Шаблон для объектов одного типа
class TechnologiesSphere {
    //Метод constructor() внутри класса вызывается автоматически каждый раз, когда создаётся объект.
    constructor() {
        this.sphere = document.querySelector('.technologies__sphere-3d');
        this.technologiesSphereWrap = document.querySelector('.technologies__sphere-wrapper');
        this.technologiesPoints = document.querySelectorAll('.technologies__sphere-point');
        this.technologiesInfo = document.getElementById('technologiesInfo');
        this.technologiesInfoTitle = document.getElementById('technologiesInfoTitle');
        this.technologiesInfoText = document.getElementById('technologiesInfoText');

        this.sphereRadius = 220; //Радиус диска
        this.technologiesStates = new Map(); // Создание коллекции
        this.animationId = null;
        this.isAnimation = true;

        this.init(); // Вызов функции init
    }

    init() {
        this.initializeTechnologiesPositions();
        this.setupEventListeners();
        this.startAnimation();
    }

    //Инициализация случайных позиций
    initializeTechnologiesPositions() {
        // Перебор всех объектов технологии
        this.technologiesPoints.forEach((point, index) => {
            // Присваиваем технологиям случайную позицию внутри диска
            const angle = Math.random() * Math.PI * 2;
            let distance = 50 + Math.random() * 200; //От 50px до 200px от центра
            
            const depth = (Math.random() - 0.5) * 100; //Глубина расположения технологий от -50px до 50px

            const position = {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                z: depth,
                angle: angle,
                distance: distance,
                depth: depth
            };
            console.log(position);
        
            //Случайная скорость движения
            const velocity = {
                angle: (Math.random() - 0.5) * 0.02,
                distance: (Math.random() - 0.5) * 0.8,
                depth: (Math.random() - 0.5) * 0.5
            };

            this.technologiesStates.set(point, {
                position: position,
                velocity: velocity,
                isHovered: false
            });

            this.updateTechnologiesPosition(point);
        });
    }

    // Обновление позиций технологии
    updateTechnologiesPosition(point) {
        const state = this.technologiesStates.get(point);
        if (!state) return;

        const { position } = state;

        //Эффект объема в зависимости от глубины
        const depthFactor = (position.z + 50) / 100; //от 0 до 1
        const scale = 0.7 + depthFactor * 0.6; // Масштаб от 0,7 до 1,3
        const opacity = 0.6 + depthFactor * 0.4; // Прозрачность от 0,6 до 1
        
        const transform = `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`;

        point.style.transform = transform;
        point.style.opacity = opacity;
        point.style.zIndex = Math.round(50 + position.z);
    }

    //Анимация случайного движения технологий
    animateTechnologiesMovement() {
        if (!this.isAnimation) return;

        this.technologiesPoints.forEach(point => {
            const state = this.technologiesStates.get(point);
            if (!state || state.isHovered) return;

            const { position, velocity } = state;

            //Обновляем позицию
            position.angle += velocity.angle;
            position.distance += velocity.distance;
            position.z += velocity.depth;

            //Ограничиваем расстояние от центра
            if (position.distance < 50) {
                position.distance = 50;
                velocity.distance *= -1;
            }

            if (position.distance > this.sphereRadius - 50) {
                position.distance = this.sphereRadius - 50;
                velocity.distance *= -1;
            }

            //ограничиваем глубину
            if (position.z < -50) {
                position.z = -50;
                velocity.depth *= -1;
            }
            if (position.z > 50) {
                position.z = 50;
                velocity.depth *= -1;
            }

            //Обновляем координаты
            position.x = Math.cos(position.angle) * position.distance;
            position.y = Math.sin(position.angle) * position.distance;

            //Случайное изменение скорости
            if (Math.random() < 0.01) {
                velocity.angle = (Math.random() - 0.5) * 0.02;
            }
            if (Math.random() < 0.005) {
                velocity.distance = (Math.random() - 0.5) * 0.8;
            }
            if (Math.random() < 0.005) {
                velocity.depth = (Math.random() - 0.5) * 0.5;
            }

            this.updateTechnologiesPosition(point);
        });
    }

    //Главный анимационный цикл
    animate() {
        this.animateTechnologiesMovement();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        this.isAnimation = true;
        if (!this.animationId) {
            this.animate();
        }
    }

    stopAnimation() {
        this.isAnimation = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupEventListeners() {
        this.technologiesPoints.forEach(point => {
            point.addEventListener('mouseenter', (e) => {
                const state = this.technologiesStates.get(point);
                if (state) state.isHovered = true;

                //Останавливаем движение диска и движение технологий
                this.sphere.classList.add('paused');
                this.stopAnimation();

                const tech = point.getAttribute('data-tech');
                this.technologiesInfoTitle.textContent = technologiesData[tech].title;
                this.technologiesInfoText.textContent = technologiesData[tech].text;
                this.technologiesInfo.classList.add('active');

                point.style.zIndex = '1000';
            });

            point.addEventListener('mouseleave', (e) => {
                const state = this.technologiesStates.get(point);
                if (state) state.isHovered = false;

                //Вообновляем движение диска и технологий
                this.sphere.classList.remove('paused');
                this.startAnimation();
                point.style.zIndex = Math.round(50 + state.position.z);

                setTimeout(() => {
                    if (!this.technologiesInfo.matches(':hover')) {
                        this.technologiesInfo.classList.remove('active');
                    }
                }, 300);
            });

            point.addEventListener('click', (e) => {
                const tech = point.getAttribute('data-tech');
                this.technologiesInfoTitle.textContent = technologiesData[tech].title;
                this.technologiesInfoText.textContent = technologiesData[tech].text;
                this.technologiesInfo.classList.add('active');
                this.sphere.classList.add('paused');
                this.stopAnimation();
            });
        });

        this.technologiesInfo.addEventListener('mouseenter', () => {
            this.technologiesInfo.classList.add('active');
            this.sphere.classList.add('paused');
            this.stopAnimation();
        });

        this.technologiesInfo.addEventListener('mouseleave', () => {
            this.technologiesInfo.classList.remove('active');
            this.sphere.classList.remove('paused');
            this.stopAnimation();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.technologies__sphere-point') && !e.target.closest('.technologies-info')) {
                this.technologiesInfo.classList.remove('active');
                this.sphere.classList.remove('paused');
                this.startAnimation();
            }
        });
    }
}

//Инициализация при запуске
document.addEventListener('DOMContentLoaded', () => {
    const technologiesShpere = new TechnologiesSphere();
});

// ========== PORTFOLIO FILTERS (Фильтры портфолио) ==========
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.portfolio__filter');
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Обновление активной кнопки
            filterButtons.forEach(btn => btn.classList.remove('portfolio__filter--active'));
            button.classList.add('portfolio__filter--active');
            
            // Фильтрация элементов
            filterPortfolioItems(filter, portfolioItems);
            currentFilter = filter;
        });
    });
}

function filterPortfolioItems(filter, items) {
    items.forEach(item => {
        const shouldShow = filter === '*' || item.classList.contains(filter.substring(1));
        
        if (shouldShow) {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.remove('hidden');
            }, 10);
        } else {
            item.classList.add('hidden');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Обновление AOS анимаций
    setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 350);
}

// ========== PROJECT MODAL (Модальные окна проектов) ==========
// Функцию открытия модального окна
// async function openProjectModal(projectId) {
//     const modal = document.getElementById('projectModal');
//     const modalBody = document.getElementById('modalBody');
    
//     if (!modal || !modalBody || !projectData[projectId]) return;
    
//     const project = projectData[projectId];
    
//     // Загружаем комментарии ДО создания HTML
//     const projectComments = await loadComments(projectId);
    
//     // Создание HTML для модального окна с БЛОКОМ КОММЕНТАРИЕВ
//     modalBody.innerHTML = `
//         <div class="project-modal">
//             <div class="project-modal__header">
//                 <h2 class="project-modal__title">${project.title}</h2>
//                 <p class="project-modal__category">${project.category}</p>
//             </div>
            
//             <div class="project-modal__gallery">
//                 <div class="swiper project-modal__slider">
//                     <div class="swiper-wrapper">
//                         ${project.images.map(img => `
//                             <div class="swiper-slide">
//                                 <img src="${img}" alt="${project.title}" loading="lazy">
//                             </div>
//                         `).join('')}
//                     </div>
//                     <div class="swiper-pagination"></div>
//                     <div class="swiper-button-next"></div>
//                     <div class="swiper-button-prev"></div>
//                 </div>
//             </div>
            
//             <div class="project-modal__content">
//                 <div class="project-modal__description">
//                     <h3>Описание проекта</h3>
//                     <p>${project.description}</p>
//                 </div>
                
//                 <div class="project-modal__details">
//                     <div class="project-modal__detail">
//                         <h4>Технологии</h4>
//                         <div class="project-modal__technologies">
//                             ${project.technologies.map(tech => `
//                                 <span class="project-modal__tech-badge">${tech}</span>
//                             `).join('')}
//                         </div>
//                     </div>
                    
//                     <div class="project-modal__detail">
//                         <h4>Сроки реализации</h4>
//                         <p>${project.duration}</p>
//                     </div>
                    
//                     <div class="project-modal__actions">
//                         <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary">
//                             Посмотреть сайт
//                         </a>
//                     </div>
//                 </div>
//             </div>
            
//             <!-- БЛОК КОММЕНТАРИЕВ -->
//             <div class="project-modal__comments">
//                 <h3>Комментарии и отзывы</h3>
                
//                 <!-- Форма добавления комментария -->
//                 <div class="comments-form">
//                     <h4>Оставить комментарий</h4>
//                     <form class="comment-form" id="commentForm-${projectId}">
//                         <div class="form-group">
//                             <label for="commentAuthor-${projectId}">Ваше имя *</label>
//                             <input type="text" id="commentAuthor-${projectId}" 
//                                    class="comment-input" required maxlength="50">
//                         </div>
//                         <div class="form-group">
//                             <label for="commentText-${projectId}">Комментарий *</label>
//                             <textarea id="commentText-${projectId}" 
//                                      class="comment-textarea" 
//                                      rows="4" required maxlength="500"
//                                      placeholder="Ваш отзыв о проекте..."></textarea>
//                         </div>
//                         <div class="form-group">
//                             <label for="commentRating-${projectId}">Оценка</label>
//                             <select id="commentRating-${projectId}" class="comment-rating">
//                                 <option value="5">★★★★★ Отлично</option>
//                                 <option value="4">★★★★☆ Хорошо</option>
//                                 <option value="3">★★★☆☆ Удовлетворительно</option>
//                                 <option value="2">★★☆☆☆ Плохо</option>
//                                 <option value="1">★☆☆☆☆ Очень плохо</option>
//                             </select>
//                         </div>
//                         <button type="submit" class="btn btn--primary">
//                             <span class="btn-text">Добавить комментарий</span>
//                             <span class="btn-loading" style="display: none;">Отправка...</span>
//                         </button>
//                     </form>
//                 </div>
                
//                 <!-- Список комментариев -->
//                 <div class="comments-list" id="commentsList-${projectId}">
//                     ${projectComments.length === 0 ? 
//                         '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>' : 
//                         projectComments.map(comment => `
//                             <div class="comment-item">
//                                 <div class="comment-header">
//                                     <strong>${comment.author}</strong>
//                                     <span class="comment-date">${comment.date}</span>
//                                     <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
//                                 </div>
//                                 <p class="comment-text">${comment.text}</p>
//                             </div>
//                         `).join('')
//                     }
//                 </div>
//             </div>
//         </div>
//     `;
    
//     // Инициализация обработчика формы комментария
//     initCommentForm(projectId);
    
//     // Показываем модальное окно
//     modal.classList.add('active');
//     document.body.style.overflow = 'hidden';
    
//     // Инициализация слайдера
//     setTimeout(() => {
//         initProjectModalSlider();
//     }, 100);
// }

async function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody || !projectData[projectId]) return;
    
    const project = projectData[projectId];
    
    // Загружаем комментарии
    const projectComments = await loadComments(projectId);
    
    // Создание HTML для модального окна с КАПЧЕЙ
    modalBody.innerHTML = `
        <div class="project-modal">
            <div class="project-modal__header">
                <h2 class="project-modal__title">${project.title}</h2>
                <p class="project-modal__category">${project.category}</p>
            </div>
            
            <div class="project-modal__gallery">
                <div class="swiper project-modal__slider">
                    <div class="swiper-wrapper">
                        ${project.images.map(img => `
                            <div class="swiper-slide">
                                <img src="${img}" alt="${project.title}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
            
            <div class="project-modal__content">
                <div class="project-modal__description">
                    <h3>Описание проекта</h3>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-modal__details">
                    <div class="project-modal__detail">
                        <h4>Технологии</h4>
                        <div class="project-modal__technologies">
                            ${project.technologies.map(tech => `
                                <span class="project-modal__tech-badge">${tech}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal__detail">
                        <h4>Сроки реализации</h4>
                        <p>${project.duration}</p>
                    </div>
                    
                    <div class="project-modal__actions">
                        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary">
                            Посмотреть сайт
                        </a>
                    </div>
                </div>
                
                <!-- БЛОК КОММЕНТАРИЕВ -->
                <div class="project-modal__comments">
                    <h3>Комментарии и отзывы</h3>
                    
                    <!-- Форма добавления комментария с КАПЧЕЙ -->
                    <div class="comments-form">
                        <h4>Оставить комментарий</h4>
                        <form class="comment-form" id="commentForm-${projectId}">
                            <div class="form-group">
                                <label for="commentAuthor-${projectId}">Ваше имя *</label>
                                <input type="text" id="commentAuthor-${projectId}" 
                                    class="comment-input" required maxlength="50">
                            </div>
                            <div class="form-group">
                                <label for="commentEmail-${projectId}">Email *</label>
                                <input type="email" id="commentEmail-${projectId}" 
                                    class="comment-input" required maxlength="100"
                                    placeholder="your@email.com">
                            </div>
                            <div class="form-group">
                                <label for="commentText-${projectId}">Комментарий *</label>
                                <textarea id="commentText-${projectId}" 
                                        class="comment-textarea" 
                                        rows="4" required maxlength="500"
                                        placeholder="Ваш отзыв о проекте..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Оценка</label>
                                <div class="rating-stars" id="ratingStars-${projectId}">
                                    <span class="star" data-value="1">☆</span>
                                    <span class="star" data-value="2">☆</span>
                                    <span class="star" data-value="3">☆</span>
                                    <span class="star" data-value="4">☆</span>
                                    <span class="star" data-value="5">☆</span>
                                </div>
                                <input type="hidden" id="commentRating-${projectId}" value="5">
                            </div>
                            
                            <!-- МАТЕМАТИЧЕСКАЯ КАПЧА -->
                            <div class="form-group">
                                <label>Защита от спама *</label>
                                <div class="captcha-container">
                                    <div class="captcha-question" id="captchaQuestion-${projectId}"></div>
                                    <input type="number" id="captchaAnswer-${projectId}" 
                                        class="comment-input captcha-answer" 
                                        placeholder="Введите ответ" required>
                                    <input type="hidden" id="captchaHash-${projectId}">
                                    <button type="button" class="btn btn--small btn--outline" 
                                            onclick="refreshCaptcha(${projectId})">
                                        🔄 Обновить
                                    </button>
                                </div>
                                <small class="captcha-hint">Решите простую математическую задачу</small>
                            </div>
                            
                            <button type="submit" class="btn btn--primary">
                                <span class="btn-text">Добавить комментарий</span>
                                <span class="btn-loading" style="display: none;">Отправка...</span>
                            </button>
                        </form>
                    </div>
                    
                    <!-- Список комментариев -->
                    <div class="comments-list" id="commentsList-${projectId}">
                        ${projectComments.length === 0 ? 
                            '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>' : 
                            projectComments.map(comment => {
                                // Генерируем аватар для комментария
                                let avatarUrl = comment.avatar;
                                if (!avatarUrl && comment.email) {
                                    // Генерируем Gravatar на основе email
                                    avatarUrl = `https://www.gravatar.com/avatar/${md5(comment.email)}?d=identicon&s=60`;
                                } else if (!avatarUrl) {
                                    // Если нет email, используем дефолтную аватарку
                                    avatarUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
                                }
                                
                                return `
                                <div class="comment-item">
                                    <div class="comment-header">
                                        <div class="comment-author">
                                            <img src="${avatarUrl}" alt="${comment.author}" class="comment-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLzc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'">
                                            <div class="comment-author-info">
                                                <strong>${comment.author}</strong>
                                                <span class="comment-date">${comment.date}</span>
                                            </div>
                                        </div>
                                        <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                                    </div>
                                    <p class="comment-text">${comment.text}</p>
                                </div>
                                `;
                            }).join('')
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Инициализация капчи
    initCaptcha(projectId);
    
    // Инициализация обработчика формы комментария
    initCommentForm(projectId);
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Инициализация слайдера
    setTimeout(() => {
        initProjectModalSlider();
    }, 100);
}

// Функция обновления капчи
function refreshCaptcha(projectId) {
    const captcha = initCaptcha(projectId);
    updateCaptchaInForm(projectId, captcha);
}


// Функция обновления списка комментариев
async function updateCommentsList(projectId) {
    const commentsList = document.getElementById(`commentsList-${projectId}`);
    const projectComments = await loadComments(projectId);
    
    if (commentsList) {
        if (projectComments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <p>Пока нет одобренных комментариев.</p>
                    <p>Ваш комментарий будет показан после проверки модератором.</p>
                </div>
            `;
        } else {
            commentsList.innerHTML = projectComments.map(comment => {
                // Генерируем аватар для старых комментариев, где нет поля avatar
                let avatarUrl = comment.avatar;
                if (!avatarUrl && comment.email) {
                    // Генерируем Gravatar на основе email
                    avatarUrl = `https://www.gravatar.com/avatar/${md5(comment.email)}?d=identicon&s=60`;
                } else if (!avatarUrl) {
                    // Если нет email, используем дефолтную аватарку
                    avatarUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLzc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
                }
                
                return `
                <div class="comment-item">
                    <div class="comment-header">
                        <div class="comment-author">
                            <img src="${avatarUrl}" alt="${comment.author}" class="comment-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'">
                            <div class="comment-author-info">
                                <strong>${comment.author}</strong>
                                <span class="comment-date">${comment.date}</span>
                            </div>
                        </div>
                        <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                </div>
                `;
            }).join('');
        }
    }
}


function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Очистка содержимого через некоторое время
    setTimeout(() => {
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = '';
        }
    }, 300);
}

function initProjectModalSlider() {
    const modalSlider = document.querySelector('.project-modal__slider');
    if (!modalSlider || typeof Swiper === 'undefined') return;
    
    new Swiper(modalSlider, {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        }
    });
}

// Закрытие модального окна по нажатию Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});


// ========== CAPTCHA SYSTEM (Математическая капча) ==========
function generateCaptcha() {
    // Генерируем простую математическую задачу
    const operations = [
        { type: '+', fn: (a, b) => a + b },
        { type: '-', fn: (a, b) => a - b },
        { type: '*', fn: (a, b) => a * b }
    ];
    
    // Выбираем случайную операцию
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    // Генерируем числа в зависимости от операции
    let num1, num2;
    switch (op.type) {
        case '+':
            num1 = Math.floor(Math.random() * 10) + 1; // 1-10
            num2 = Math.floor(Math.random() * 10) + 1; // 1-10
            break;
        case '-':
            num1 = Math.floor(Math.random() * 10) + 5; // 5-14
            num2 = Math.floor(Math.random() * 5) + 1;  // 1-5
            // Гарантируем положительный результат
            if (num1 < num2) [num1, num2] = [num2, num1];
            break;
        case '*':
            num1 = Math.floor(Math.random() * 5) + 1;  // 1-5
            num2 = Math.floor(Math.random() * 5) + 1;  // 1-5
            break;
    }
    
    // Вычисляем правильный ответ
    const answer = op.fn(num1, num2);
    
    return {
        question: `Сколько будет ${num1} ${op.type} ${num2}?`,
        answer: answer.toString()
    };
}

// Функция для обновления капчи в форме
function updateCaptchaInForm(projectId, captcha) {
    const captchaElement = document.getElementById(`captchaQuestion-${projectId}`);
    const answerInput = document.getElementById(`captchaAnswer-${projectId}`);
    const answerHashInput = document.getElementById(`captchaHash-${projectId}`);
    
    if (captchaElement && answerInput && answerHashInput) {
        captchaElement.textContent = captcha.question;
        answerHashInput.value = captcha.answer;
        answerInput.value = ''; // Очищаем поле ответа
    }
}

// Инициализация капчи при открытии модального окна
function initCaptcha(projectId) {
    const captcha = generateCaptcha();
    updateCaptchaInForm(projectId, captcha);
    return captcha;
}

// Функция обновления капчи
function refreshCaptcha(projectId) {
    const captcha = generateCaptcha();
    updateCaptchaInForm(projectId, captcha);
    return captcha;
}


// ========== TESTIMONIAL SLIDER (Слайдер отзывов) ==========
function initTestimonialSlider() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper.js not loaded');
        return;
    }
    
    const testimonialSliderElement = document.querySelector('.testimonials__slider');
    if (!testimonialSliderElement) return;
    
    testimonialSwiper = new Swiper(testimonialSliderElement, {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.testimonials__pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.testimonials__nav--next',
            prevEl: '.testimonials__nav--prev',
        },
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        breakpoints: {
            768: {
                slidesPerView: 1,
                spaceBetween: 40,
            }
        }
    });
    
    console.log('💬 Testimonial slider initialized');
}


// ========== COMMENT SYSTEM (Система комментариев) ==========

// Функция загрузки комментариев с сервера
async function loadComments(projectId) {
    try {
        const response = await fetch(`php/comments.php?projectId=${projectId}`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки комментариев');
        }
        
        const comments = await response.json();
        return Array.isArray(comments) ? comments : [];
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        return [];
    }
}

// Функция отправки комментария на сервер с капчей
async function submitComment(projectId, author, email, text, rating, captchaAnswer, captchaHash) {
    try {
        // Создаем FormData для отправки
        const formData = new FormData();
        formData.append('project_id', projectId);
        formData.append('author', author);
        formData.append('email', email);
        formData.append('text', text);
        formData.append('rating', rating);
        formData.append('captcha_answer', captchaAnswer);
        formData.append('captcha_hash', captchaHash);

        const response = await fetch('php/save_comment.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Ошибка сервера');
        }
        
        return result;
    } catch (error) {
        console.error('Ошибка отправки комментария:', error);
        throw error;
    }
}

// Функция добавления комментария с капчей
async function addComment(projectId, author, email, text, rating, captchaAnswer, captchaHash) {
    try {
        const result = await submitComment(projectId, author, email, text, rating, captchaAnswer, captchaHash);
        
        if (result.success) {
            // Показываем уведомление о модерации
            const message = result.needs_moderation ? 
                'Комментарий успешно добавлен и ожидает модерации!' : 
                'Комментарий успешно добавлен!';
            
            showNotification(message, 'success');
            return result.comment;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showNotification('Ошибка: ' + error.message, 'error');
        throw error;
    }
}

// Инициализация формы комментария с капчей
function initCommentForm(projectId) {
    const commentForm = document.getElementById(`commentForm-${projectId}`);
    const submitBtn = commentForm?.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    // Инициализация звезд рейтинга
    initRatingStars(projectId);
    
    if (commentForm && submitBtn) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const author = document.getElementById(`commentAuthor-${projectId}`).value.trim();
            const email = document.getElementById(`commentEmail-${projectId}`).value.trim();
            const text = document.getElementById(`commentText-${projectId}`).value.trim();
            const rating = document.getElementById(`commentRating-${projectId}`).value;
            const captchaAnswer = document.getElementById(`captchaAnswer-${projectId}`).value.trim();
            const captchaHash = document.getElementById(`captchaHash-${projectId}`).value;
            
            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Введите корректный email адрес', 'error');
                return;
            }
            
            // Валидация
            if (!author || !email || !text || !captchaAnswer) {
                showNotification('Заполните все обязательные поля', 'error');
                return;
            }
            
            // Показываем состояние загрузки
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            try {
                await addComment(projectId, author, email, text, rating, captchaAnswer, captchaHash);
                
                // Обновляем список комментариев
                await updateCommentsList(projectId);
                
                // Очищаем форму и сбрасываем рейтинг
                commentForm.reset();
                resetRatingStars(projectId);
                
                // Обновляем капчу
                refreshCaptcha(projectId);
                
            } catch (error) {
                // При ошибке капчи обновляем её
                if (error.message.includes('математическую') || error.message.includes('капч')) {
                    refreshCaptcha(projectId);
                }
            } finally {
                // Восстанавливаем кнопку
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification__close">&times;</button>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#f56565' : '#48bb78'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Добавляем в body
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Закрытие по клику
    notification.querySelector('.notification__close').addEventListener('click', () => {
        notification.remove();
    });
}

// ========== REATING STAR (Звездный рейтинг) ==========
// Функция инициализации звезд рейтинга
function initRatingStars(projectId) {
    const starsContainer = document.getElementById(`ratingStars-${projectId}`);
    const ratingInput = document.getElementById(`commentRating-${projectId}`);
    const stars = starsContainer.querySelectorAll('.star');
    
    let currentRating = parseInt(ratingInput.value) || 5;
    
    // Функция обновления отображения звезд
    function updateStarsDisplay(rating) {
        stars.forEach((star, index) => {
            const starValue = index + 1;
            if (starValue <= rating) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }
    
    // Инициализация отображения
    updateStarsDisplay(currentRating);
    
    // Обработчики событий для звезд
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-value'));
            currentRating = rating;
            ratingInput.value = rating;
            updateStarsDisplay(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-value'));
            updateStarsDisplay(hoverRating);
        });
    });
    
    // Восстановление рейтинга при уходе мыши
    starsContainer.addEventListener('mouseleave', function() {
        updateStarsDisplay(currentRating);
    });
}

// Функция сброса звезд рейтинга к значению по умолчанию
function resetRatingStars(projectId) {
    const starsContainer = document.getElementById(`ratingStars-${projectId}`);
    const ratingInput = document.getElementById(`commentRating-${projectId}`);
    const stars = starsContainer.querySelectorAll('.star');
    
    // Устанавливаем рейтинг по умолчанию (5)
    ratingInput.value = '5';
    
    // Обновляем отображение звезд
    stars.forEach((star, index) => {
        const starValue = index + 1;
        if (starValue <= 5) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
}

// ========== RECENT COMMENTS SLIDER (Слайдер последних комментариев) ==========
let recentCommentsSwiper = null;

async function loadRecentComments(limit = 6) {
    try {
        const sliderWrapper = document.getElementById('recentCommentsSlider');
        if (!sliderWrapper) return;
        
        // Показываем загрузку
        sliderWrapper.innerHTML = `
            <div class="swiper-slide recent-comments__loading">
                <div class="loading-spinner"></div>
                <p>Загрузка отзывов...</p>
            </div>
        `;
        
        const response = await fetch(`php/comments.php?recent=${limit}`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки комментариев');
        }
        
        const comments = await response.json();
        displayRecentComments(comments);
    } catch (error) {
        console.error('Ошибка загрузки последних комментариев:', error);
        showRecentCommentsError();
    }
}

function displayRecentComments(comments) {
    const sliderWrapper = document.getElementById('recentCommentsSlider');
    if (!sliderWrapper) return;
    
    if (!comments || comments.length === 0) {
        sliderWrapper.innerHTML = `
            <div class="swiper-slide recent-comments__empty">
                <p>Пока нет комментариев. Будьте первым, кто оставит отзыв!</p>
            </div>
        `;
        return;
    }
    
    // Сортируем комментарии по дате (новые первые)
    comments.sort((a, b) => {
        const dateA = new Date(a.date || a.created_at);
        const dateB = new Date(b.date || b.created_at);
        return dateB - dateA;
    });
    
    sliderWrapper.innerHTML = comments.map(comment => {
        // Правильно форматируем дату
        const dateStr = comment.date || comment.created_at;
        let formattedDate = 'Дата неизвестна';
        
        if (dateStr) {
            try {
                // Преобразуем разные форматы даты
                let date;
                if (dateStr.includes('T')) {
                    // ISO формат: "2024-01-15T14:30:00"
                    date = new Date(dateStr);
                } else {
                    // Простой формат: "2024-01-15 14:30:00"
                    date = new Date(dateStr.replace(' ', 'T'));
                }
                
                // Проверяем валидность даты
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                }
            } catch (e) {
                console.warn('Ошибка форматирования даты:', dateStr, e);
            }
        }
        
        // Получаем название проекта
        const projectId = comment.project_id || comment.projectId;
        const projectTitle = projectData[projectId]?.title || 'Проект';
        
        // Генерируем аватар
        let avatarUrl = comment.avatar;
        if (!avatarUrl && comment.email) {
            // Используем gravatar на основе email
            const emailHash = md5(comment.email.toLowerCase());
            avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=64`;
        } else if (!avatarUrl) {
            // Дефолтный аватар
            avatarUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNlMWUxZTEiLz4KPHBhdGggZD0iTTI0IDI0YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6TTE2IDQwYzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDhINjRjMC04LjgzNy03LjE2My0xNi0xNi0xNnMtMTYgNy4xNjMtMTYgMTZ6IiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
        }
        
        // Обрезаем текст если длинный
        const maxLength = 180;
        let commentText = comment.text || '';
        if (commentText.length > maxLength) {
            commentText = commentText.substring(0, maxLength) + '...';
        }
        
        const rating = parseInt(comment.rating) || 5;
        
        return `
        <div class="swiper-slide recent-comments__slide" onclick="openProjectModal(${projectId})" style="cursor: pointer;">
            <div class="recent-comment__header">
                <div>
                    <div class="recent-comment__project">${projectTitle}</div>
                    <div class="recent-comment__author">
                        <img src="${avatarUrl}" alt="${comment.author}" class="recent-comment__avatar">
                        <span>${comment.author}</span>
                    </div>
                </div>
                <div class="recent-comment__date">${formattedDate}</div>
            </div>
            <div class="recent-comment__text">${commentText}</div>
            <div class="recent-comment__rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
        </div>
        `;
    }).join('');
    
    // Инициализируем слайдер после загрузки данных
    initRecentCommentsSlider();
}

function showRecentCommentsError() {
    const sliderWrapper = document.getElementById('recentCommentsSlider');
    if (sliderWrapper) {
        sliderWrapper.innerHTML = `
            <div class="swiper-slide recent-comments__error">
                <p>Не удалось загрузить комментарии. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
}

function initRecentCommentsSlider() {
    const sliderElement = document.querySelector('.recent-comments__slider');
    if (!sliderElement || typeof Swiper === 'undefined') return;
    
    // Удаляем старый слайдер если есть
    if (recentCommentsSwiper) {
        recentCommentsSwiper.destroy();
    }
    
    recentCommentsSwiper = new Swiper(sliderElement, {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.recent-comments__pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.recent-comments__nav--next',
            prevEl: '.recent-comments__nav--prev',
        },
        loop: true,
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });
    
    console.log('💬 Recent comments slider initialized');
}

// Простая функция MD5 если нет библиотеки
window.md5 = function(input) {
    if (typeof CryptoJS !== 'undefined') {
        return CryptoJS.MD5(input).toString();
    }
    // Простая заглушка для тестирования
    return '00000000000000000000000000000000';
};

function parseDate(dateString) {
    if (!dateString) return new Date(0);
    
    console.log('Парсим дату:', dateString);
    
    // Пытаемся все возможные форматы
    const patterns = [
        // Русский формат с временем: "08.12.2025 22:34"
        /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/,
        // Русский формат с секундами: "08.12.2025 22:34:15"
        /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
        // Стандартный формат: "2025-12-08 22:34:00"
        /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
        // ISO формат: "2025-12-08T22:34:00"
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
        // Только дата: "2025-12-08"
        /^(\d{4})-(\d{2})-(\d{2})$/
    ];
    
    for (const pattern of patterns) {
        const match = dateString.match(pattern);
        if (match) {
            let year, month, day, hour = 12, minute = 0, second = 0;
            
            if (pattern.source.includes('\\d{4}-\\d{2}-\\d{2}')) {
                // Формат начинается с года
                [year, month, day, hour, minute, second] = match.slice(1);
            } else {
                // Формат начинается с дня
                [day, month, year, hour, minute, second] = match.slice(1);
            }
            
            // Заполняем недостающие значения
            hour = hour || 12;
            minute = minute || 0;
            second = second || 0;
            
            const date = new Date(year, month - 1, day, hour, minute, second);
            
            if (!isNaN(date.getTime())) {
                console.log('Успешно распарсено:', date);
                return date;
            }
        }
    }
    
    // Последняя попытка - стандартный парсинг
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date;
    }
    
    console.warn('Не удалось распарсить дату:', dateString);
    return new Date(0);
}

// ========== RECENT COMMENTS (Последние комментарии) ==========
// async function loadRecentComments(limit = 6) {
//     try {
//         const response = await fetch(`php/comments.php?recent=${limit}`);
        
//         if (!response.ok) {
//             throw new Error('Ошибка загрузки комментариев');
//         }
        
//         const comments = await response.json();
//         displayRecentComments(comments);
//     } catch (error) {
//         console.error('Ошибка загрузки последних комментариев:', error);
//         showRecentCommentsError();
//     }
// }

// function displayRecentComments(comments) {
//     const commentsGrid = document.getElementById('recentCommentsGrid');
//     if (!commentsGrid) return;
    
//     if (!comments || comments.length === 0) {
//         commentsGrid.innerHTML = `
//             <div class="recent-comments__empty" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #718096;">
//                 <p>Пока нет комментариев. Будьте первым, кто оставит отзыв!</p>
//             </div>
//         `;
//         return;
//     }
    
//     commentsGrid.innerHTML = comments.map(comment => {
//         // Форматируем дату
//         const date = new Date(comment.date || comment.created_at);
//         const formattedDate = date.toLocaleDateString('ru-RU', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric'
//         });
        
//         // Получаем название проекта
//         const projectTitle = projectData[comment.project_id]?.title || 'Проект';
        
//         // Генерируем аватар
//         let avatarUrl = comment.avatar;
//         if (!avatarUrl && comment.email) {
//             // Используем gravatar на основе email
//             const emailHash = CryptoJS.MD5(comment.email.toLowerCase()).toString();
//             avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=40`;
//         }
        
//         // Обрезаем текст если длинный
//         const maxLength = 120;
//         let commentText = comment.text;
//         if (commentText.length > maxLength) {
//             commentText = commentText.substring(0, maxLength) + '...';
//         }
        
//         return `
//         <div class="recent-comment-card" onclick="openProjectModal(${comment.project_id})" style="cursor: pointer;">
//             <div class="recent-comment__header">
//                 <div>
//                     <div class="recent-comment__project">${projectTitle}</div>
//                     <div class="recent-comment__author">
//                         ${avatarUrl ? `<img src="${avatarUrl}" alt="${comment.author}" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 6px; vertical-align: middle; object-fit: cover;">` : ''}
//                         ${comment.author}
//                     </div>
//                 </div>
//                 <div class="recent-comment__date">${formattedDate}</div>
//             </div>
//             <div class="recent-comment__text">${commentText}</div>
//             <div class="recent-comment__rating">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</div>
//         </div>
//         `;
//     }).join('');
// }

// function showRecentCommentsError() {
//     const commentsGrid = document.getElementById('recentCommentsGrid');
//     if (commentsGrid) {
//         commentsGrid.innerHTML = `
//             <div class="recent-comments__error" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #718096;">
//                 <p>Не удалось загрузить комментарии. Пожалуйста, попробуйте позже.</p>
//             </div>
//         `;
//     }
// }

// Простая функция MD5 если нет библиотеки
// if (typeof CryptoJS === 'undefined') {
//     window.md5 = function(input) {
//         // Простая заглушка для тестирования
//         return '00000000000000000000000000000000';
//     };
// }


// function displayRecentComments(comments) {
//     const commentsGrid = document.getElementById('recentCommentsGrid');
//     if (!commentsGrid) return;
    
//     if (!comments || comments.length === 0) {
//         commentsGrid.innerHTML = `
//             <div class="recent-comments__empty" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-gray-500);">
//                 <p>Пока нет комментариев. Будьте первым, кто оставит отзыв!</p>
//             </div>
//         `;
//         return;
//     }
    
//     commentsGrid.innerHTML = comments.map(comment => {
//         // Форматируем дату
//         const date = new Date(comment.date);
//         const formattedDate = date.toLocaleDateString('ru-RU', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric'
//         });
        
//         // Получаем название проекта
//         const projectTitle = projectData[comment.project_id]?.title || 'Проект';
        
//         // Генерируем аватар
//         let avatarUrl = comment.avatar;
//         if (!avatarUrl && comment.email) {
//             avatarUrl = `https://www.gravatar.com/avatar/${md5(comment.email)}?d=identicon&s=40`;
//         }
        
//         return `
//         <div class="recent-comment-card" onclick="openProjectModal(${comment.project_id})">
//             <div class="recent-comment__header">
//                 <div>
//                     <div class="recent-comment__project">${projectTitle}</div>
//                     <div class="recent-comment__author">
//                         ${avatarUrl ? `<img src="${avatarUrl}" alt="${comment.author}" class="comment-avatar" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px; vertical-align: middle;">` : ''}
//                         ${comment.author}
//                     </div>
//                 </div>
//                 <div class="recent-comment__date">${formattedDate}</div>
//             </div>
//             <div class="recent-comment__text">${comment.text}</div>
//             <div class="recent-comment__rating">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</div>
//         </div>
//         `;
//     }).join('');
// }

// function showRecentCommentsError() {
//     const commentsGrid = document.getElementById('recentCommentsGrid');
//     if (commentsGrid) {
//         commentsGrid.innerHTML = `
//             <div class="recent-comments__error" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-gray-500);">
//                 <p>Не удалось загрузить комментарии. Пожалуйста, попробуйте позже.</p>
//             </div>
//         `;
//     }
// }

// Функция MD5 для генерации Gravatar (простая реализация)
// function md5(input) {
//     // Простая заглушка - в реальном проекте используйте библиотеку crypto-js
//     return btoa(input).replace(/[^a-z0-9]/gi, '').substring(0, 32);
// }


// ========== CONTACT FORM (Форма обратной связи) ==========
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const projectField = document.getElementById('project');
    const privacyField = document.getElementById('privacy');
    const submitButton = form.querySelector('.contact__form-submit');
    
    // Валидация в реальном времени
    if (nameField) {
        nameField.addEventListener('blur', () => validateField(nameField, 'name'));
        nameField.addEventListener('input', () => clearFieldError(nameField, 'nameError'));
    }
    
    if (emailField) {
        emailField.addEventListener('blur', () => validateField(emailField, 'email'));
        emailField.addEventListener('input', () => clearFieldError(emailField, 'emailError'));
    }
    
    if (projectField) {
        projectField.addEventListener('blur', () => validateField(projectField, 'project'));
        projectField.addEventListener('input', () => clearFieldError(projectField, 'projectError'));
    }
    
    // Отправка формы
    form.addEventListener('submit', handleFormSubmit);
    
    console.log('📝 Contact form initialized');
}

function validateField(field, type) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (type) {
        case 'name':
            if (!value) {
                errorMessage = 'Пожалуйста, введите ваше имя';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Имя должно содержать минимум 2 символа';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Пожалуйста, введите email или телефон';
                isValid = false;
            } else {
                // Проверка email или телефона
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^[\+]?[1-9][\d]{6,14}$/;
                
                if (!emailRegex.test(value) && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    errorMessage = 'Введите корректный email или номер телефона';
                    isValid = false;
                }
            }
            break;
            
        case 'project':
            if (!value) {
                errorMessage = 'Пожалуйста, опишите ваш проект';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Описание должно содержать минимум 10 символов';
                isValid = false;
            }
            break;
    }
    
    showFieldError(field, errorMessage, isValid);
    return isValid;
}

function showFieldError(field, errorMessage, isValid) {
    const errorElement = document.getElementById(field.name + 'Error');
    
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        if (errorElement) errorElement.textContent = '';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        if (errorElement) errorElement.textContent = errorMessage;
    }
}

function clearFieldError(field, errorId) {
    field.classList.remove('invalid', 'valid');
    const errorElement = document.getElementById(errorId);
    if (errorElement) errorElement.textContent = '';
}
//Вариант для симуляции отправки
// async function handleFormSubmit(e) {
//     e.preventDefault();
    
//     const form = e.target;
//     const submitButton = form.querySelector('.contact__form-submit');
//     const nameField = form.querySelector('#name');
//     const emailField = form.querySelector('#email');
//     const projectField = form.querySelector('#project');
//     const privacyField = form.querySelector('#privacy');
    
//     // Валидация всех полей
//     const isNameValid = validateField(nameField, 'name');
//     const isEmailValid = validateField(emailField, 'email');
//     const isProjectValid = validateField(projectField, 'project');
    
//     let isPrivacyValid = true;
//     if (!privacyField.checked) {
//         alert('Пожалуйста, согласитесь с политикой конфиденциальности');
//         isPrivacyValid = false;
//     }
    
//     if (!isNameValid || !isEmailValid || !isProjectValid || !isPrivacyValid) {
//         return;
//     }
    
//     // Показать состояние загрузки
//     submitButton.classList.add('loading');
//     submitButton.disabled = true;
    
//     try {
//         // Симуляция отправки формы
//         await simulateFormSubmission({
//             name: nameField.value,
//             email: emailField.value,
//             project: projectField.value
//         });
        
//         // Успешная отправка
//         showSuccessMessage();
//         form.reset();
        
//         // Очистка валидации
//         [nameField, emailField, projectField].forEach(field => {
//             field.classList.remove('valid', 'invalid');
//         });
        
//     } catch (error) {
//         console.error('Form submission error:', error);
//         showErrorMessage();
//     } finally {
//         // Убрать состояние загрузки
//         submitButton.classList.remove('loading');
//         submitButton.disabled = false;
//     }
// }

// Модифицируем handleFormSubmit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.contact__form-submit');
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const projectField = form.querySelector('#project');
    const privacyField = form.querySelector('#privacy');
    
    // Валидация всех полей
    const isNameValid = validateField(nameField, 'name');
    const isEmailValid = validateField(emailField, 'email');
    const isProjectValid = validateField(projectField, 'project');
    
    let isPrivacyValid = true;
    if (!privacyField.checked) {
        showNotification('Пожалуйста, согласитесь с политикой конфиденциальности', 'error');
        isPrivacyValid = false;
    }
    
    if (!isNameValid || !isEmailValid || !isProjectValid || !isPrivacyValid) {
        return;
    }
    
    // Показать состояние загрузки
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Отправляем данные
        const result = await submitFormData({
            name: nameField.value,
            email: emailField.value,
            project: projectField.value
        });
        
        // Успешная отправка
        showNotification(result.message, 'success');
        form.reset();
        
        // Очистка валидации
        [nameField, emailField, projectField].forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification(error.message, 'error');
    } finally {
        // Убрать состояние загрузки
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}


//Функция симуляции отправки формы
// function simulateFormSubmission(data) {
//     return new Promise((resolve) => {
//         console.log('📤 Form submission:', data);
//         setTimeout(resolve, 2000); // Симуляция задержки сети
//     });
// }


// Заменяем simulateFormSubmission на реальную отправку
async function submitFormData(data) {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('project', data.project);
        formData.append('privacy', 'true');
        
        const response = await fetch('php/send_form.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Ошибка сервера');
        }
        
        return result;
    } catch (error) {
        console.error('Form submission error:', error);
        throw new Error('Ошибка сети. Пожалуйста, попробуйте еще раз.');
    }
}

// Модифицируем handleFormSubmit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.contact__form-submit');
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const projectField = form.querySelector('#project');
    const privacyField = form.querySelector('#privacy');
    
    // Валидация всех полей
    const isNameValid = validateField(nameField, 'name');
    const isEmailValid = validateField(emailField, 'email');
    const isProjectValid = validateField(projectField, 'project');
    
    let isPrivacyValid = true;
    if (!privacyField.checked) {
        showNotification('Пожалуйста, согласитесь с политикой конфиденциальности', 'error');
        isPrivacyValid = false;
    }
    
    if (!isNameValid || !isEmailValid || !isProjectValid || !isPrivacyValid) {
        return;
    }
    
    // Показать состояние загрузки
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Отправляем данные
        const result = await submitFormData({
            name: nameField.value,
            email: emailField.value,
            project: projectField.value
        });
        
        // Успешная отправка
        showNotification(result.message, 'success');
        form.reset();
        
        // Очистка валидации
        [nameField, emailField, projectField].forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification(error.message, 'error');
    } finally {
        // Убрать состояние загрузки
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}



function showSuccessMessage() {
    alert('✅ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
}

function showErrorMessage() {
    alert('❌ Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
}

// ========== SMOOTH SCROLL (Плавный скролл) ==========
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target && href !== '#') {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.nav')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== SCROLL EFFECTS (Эффекты при скролле) ==========
function handleScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero__decoration');
        
        // Параллакс эффект для декоративных элементов
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate);
}

// ========== RESIZE EVENTS (События изменения размера) ==========
function handleResizeEvents() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Обновление AOS при изменении размера
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Обновление слайдеров
            if (testimonialSwiper) {
                testimonialSwiper.update();
            }
            
            console.log('📱 Window resized, components updated');
        }, 250);
    });
}

// ========== UTILITY FUNCTIONS (Вспомогательные функции) ==========

// Throttle функция для оптимизации событий
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce функция для оптимизации событий
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Проверка видимости элемента в viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Добавление CSS стилей для модального окна проектов
const modalStyles = `
<style>
.project-modal {
    padding: 0;
}

.project-modal__header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    text-align: center;
}

.project-modal__title {
    margin-bottom: 0.5rem;
    font-size: 2rem;
    color: #1a202c;
}

.project-modal__category {
    color: #718096;
    font-size: 1rem;
    margin-bottom: 0;
}

.project-modal__gallery {
    position: relative;
    height: 400px;
}

.project-modal__slider {
    height: 100%;
}

.project-modal__slider img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.project-modal__content {
    padding: 2rem;
}

.project-modal__description h3,
.project-modal__detail h4 {
    color: #1a202c;
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

.project-modal__description p {
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.project-modal__details {
    display: grid;
    gap: 1.5rem;
}

.project-modal__technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.project-modal__tech-badge {
    background: linear-gradient(135deg, #3182ce, #f56500);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.project-modal__actions {
    margin-top: 1.5rem;
    text-align: center;
}

@media (max-width: 768px) {
    .project-modal__header {
        padding: 1.5rem 1.5rem 1rem;
    }
    
    .project-modal__title {
        font-size: 1.5rem;
    }
    
    .project-modal__content {
        padding: 1.5rem;
    }
    
    .project-modal__gallery {
        height: 250px;
    }
}
</style>
`;

// Добавляем стили в head
if (!document.querySelector('#modal-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'modal-styles';
    styleElement.innerHTML = modalStyles;
    document.head.appendChild(styleElement);
}

// Экспорт функций для глобального доступа
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.refreshCaptcha = refreshCaptcha;
window.loadComments = loadComments;
window.updateCommentsList = updateCommentsList;
window.initRatingStars = initRatingStars;
window.resetRatingStars = resetRatingStars;


// Добавьте эти стили в конец файла script.js
const avatarStyles = `
<style>
.comment-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: white;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.comment-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.comment-author-info {
    display: flex;
    flex-direction: column;
}

.comment-author-info strong {
    font-weight: 600;
    color: #2d3748;
}

.comment-date {
    font-size: 0.875rem;
    color: #718096;
}

.comment-rating-stars {
    color: #fbbf24;
    font-size: 1rem;
}

.comment-text {
    color: #4a5568;
    line-height: 1.5;
    margin: 0;
}

.no-comments {
    text-align: center;
    padding: 2rem;
    color: #718096;
    background: #f7fafc;
    border-radius: 8px;
    border: 1px dashed #cbd5e0;
}

@media (max-width: 768px) {
    .comment-header {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .comment-rating-stars {
        align-self: flex-start;
    }
}
</style>
`;

// Добавляем стили в head
if (!document.querySelector('#avatar-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'avatar-styles';
    styleElement.innerHTML = avatarStyles;
    document.head.appendChild(styleElement);
}

// ========= Нужно определиться со стилями для рейтинга 
// ========= какой оставляю ratingStyles или улучшенный enhancedRatingStyles
// const ratingStyles = `
// <style>
// .rating-stars {
//     display: flex;
//     gap: 4px;
//     margin: 8px 0;
// }

// .star {
//     font-size: 24px;
//     cursor: pointer;
//     color: #d1d5db;
//     transition: color 0.2s ease;
//     user-select: none;
// }

// .star:hover,
// .star.active {
//     color: #fbbf24;
// }

// .star.active {
//     color: #f59e0b;
// }

// .rating-stars:hover .star {
//     color: #fbbf24;
// }

// .rating-stars .star:hover ~ .star {
//     color: #d1d5db;
// }
// </style>
// `;

const enhancedRatingStyles = `
<style>
.rating-stars {
    display: flex;
    gap: 4px;
    margin: 8px 0;
}

.star {
    font-size: 28px;
    cursor: pointer;
    color: #d1d5db;
    transition: all 0.2s ease;
    user-select: none;
    transform: scale(1);
}

.star:hover {
    transform: scale(1.1);
    color: #fbbf24;
}

.star.active {
    color: #f59e0b;
    transform: scale(1.05);
}

.star.active:hover {
    transform: scale(1.15);
}

.rating-stars:hover .star {
    color: #fbbf24;
}

.rating-stars .star:hover ~ .star {
    color: #d1d5db;
    transform: scale(1);
}

.rating-hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 4px;
    text-align: center;
}
</style>
`;

// Замените существующие ratingStyles на enhancedRatingStyles для улучшенной версии

// Добавляем стили в head
if (!document.querySelector('#rating-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'rating-styles';
    // styleElement.innerHTML = ratingStyles;
    styleElement.innerHTML = enhancedRatingStyles;
    document.head.appendChild(styleElement);
}

console.log('🎯 A.S.K.V.G. Script fully loaded and initialized');
// После функции displayRecentComments добавьте:
// console.log('Последние комментарии загружены:', comments);