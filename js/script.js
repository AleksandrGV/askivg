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

    initTestimonialForm();
    loadRecentComments(20); // Загружаем 20 последних комментариев
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
async function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody || !projectData[projectId]) return;
    
    const project = projectData[projectId];
    
    // Загружаем комментарии ДО создания HTML
    const projectComments = await loadComments(projectId);
    
    // Создание HTML для модального окна с БЛОКОМ КОММЕНТАРИЕВ
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
            </div>
            
            <!-- БЛОК КОММЕНТАРИЕВ - ДОБАВЛЯЕМ ЭТОТ БЛОК -->
            <div class="project-modal__comments">
                <h3>Отзывы о проекте</h3>
                
                <!-- Форма добавления комментария -->
                <div class="comments-form">
                    <h4>Оставить отзыв</h4>
                    <form class="comment-form" id="commentForm-${projectId}">
                        <div class="form-group">
                            <label for="commentAuthor-${projectId}">Ваше имя *</label>
                            <input type="text" id="commentAuthor-${projectId}" 
                                class="comment-input" required maxlength="50"
                                placeholder="Как к вам обращаться?">
                        </div>
                        <div class="form-group">
                            <label for="commentText-${projectId}">Отзыв *</label>
                            <textarea id="commentText-${projectId}" 
                                    class="comment-textarea" 
                                    rows="4" required maxlength="500"
                                    placeholder="Ваш отзыв о проекте..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="commentRating-${projectId}">Оценка</label>
                            <select id="commentRating-${projectId}" class="comment-rating">
                                <option value="5">★★★★★ Отлично</option>
                                <option value="4">★★★★☆ Хорошо</option>
                                <option value="3">★★★☆☆ Удовлетворительно</option>
                                <option value="2">★★☆☆☆ Плохо</option>
                                <option value="1">★☆☆☆☆ Очень плохо</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn--primary">
                            <span class="btn-text">Добавить отзыв</span>
                            <span class="btn-loading" style="display: none;">Отправка...</span>
                        </button>
                    </form>
                </div>
                
                <!-- Список комментариев -->
                <div class="comments-list" id="commentsList-${projectId}">
                    ${projectComments.length === 0 ? 
                        '<div class="no-comments">Пока нет отзывов. Будьте первым!</div>' : 
                        projectComments.map(comment => `
                            <div class="comment-item">
                                <div class="comment-header">
                                    <strong>${comment.author}</strong>
                                    <span class="comment-date">${comment.date}</span>
                                    <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                                </div>
                                <p class="comment-text">${comment.text}</p>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
    
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

// Инициализация формы комментария
function initCommentForm(projectId) {
    const commentForm = document.getElementById(`commentForm-${projectId}`);
    const submitBtn = commentForm?.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    if (commentForm && submitBtn) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const author = document.getElementById(`commentAuthor-${projectId}`).value.trim();
            const text = document.getElementById(`commentText-${projectId}`).value.trim();
            const rating = document.getElementById(`commentRating-${projectId}`).value;
            
            // Валидация
            if (!author || !text) {
                showNotification('Заполните все обязательные поля', 'error');
                return;
            }
            
            // Показываем состояние загрузки
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            try {
                const newComment = await addComment(projectId, author, text, rating);
                
                // Обновляем список комментариев
                await updateCommentsList(projectId);
                
                // Очищаем форму
                commentForm.reset();
                
            } catch (error) {
                // Ошибка уже обработана в addComment
            } finally {
                // Восстанавливаем кнопку
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }
}

// Функция обновления списка комментариев
async function updateCommentsList(projectId) {
    const commentsList = document.getElementById(`commentsList-${projectId}`);
    const projectComments = await loadComments(projectId);
    
    if (commentsList) {
        if (projectComments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
        } else {
            commentsList.innerHTML = projectComments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <strong>${comment.author}</strong>
                        <span class="comment-date">${comment.date}</span>
                        <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                </div>
            `).join('');
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

// Функция отправки комментария на сервер
async function submitComment(projectId, author, text, rating, position = '') {
    try {
        // Создаем FormData для отправки
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('author', author);
        formData.append('text', text);
        formData.append('rating', rating);
        formData.append('position', position);

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

// Функция загрузки последних комментариев
async function loadRecentComments(limit = 20) {
    try {
        const response = await fetch(`php/get_comments.php?limit=${limit}`);
        if (response.ok) {
            const comments = await response.json();
            displayRecentComments(comments);
        }
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
    }
}

// Функция отображения комментариев
function displayRecentComments(comments) {
    const container = document.getElementById('recentCommentsList');
    if (!container) return;

    if (!comments || comments.length === 0) {
        container.innerHTML = '<div class="no-comments">Пока нет отзывов. Будьте первым!</div>';
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="recent-comment">
            <div class="recent-comment__header">
                <strong class="recent-comment__author">${comment.author}</strong>
                ${comment.position ? `<span class="recent-comment__position">${comment.position}</span>` : ''}
                <span class="recent-comment__rating">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                <span class="recent-comment__date">${comment.date}</span>
            </div>
            <p class="recent-comment__text">${comment.text}</p>
            ${comment.project ? `<div class="recent-comment__project">Проект: ${comment.project}</div>` : ''}
        </div>
    `).join('');
}

// Инициализация формы отзыва на главной
function initTestimonialForm() {
    const form = document.getElementById('testimonialForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            author: formData.get('name'),
            position: formData.get('position'),
            text: formData.get('text'),
            rating: formData.get('rating'),
            type: 'testimonial' // Тип - отзыв на главной
        };

        try {
            // Используем существующую функцию добавления комментария
            await addComment('testimonial', data.author, data.text, data.rating, data.position);
            form.reset();
            // Обновляем список комментариев
            loadRecentComments();
        } catch (error) {
            // Ошибка уже обработана в addComment
        }
    });
}

// Обновляем функцию addComment для поддержки разных типов
async function addComment(projectId, author, text, rating, position = '') {
    try {
        const result = await submitComment(projectId, author, text, rating, position);
        
        if (result.success) {
            showNotification('Отзыв успешно добавлен!', 'success');
            // Обновляем список комментариев
            if (projectId === 'testimonial') {
                loadRecentComments(20);
            } else {
                await updateCommentsList(projectId);
            }
            return result.data.comment;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showNotification('Ошибка: ' + error.message, 'error');
        throw error;
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
// Новая функция отправки формы
async function submitFormData(data) {
    try {
        console.log('Отправка данных:', data);
        
        const response = await fetch('php/send_form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('Статус ответа:', response.status);
        
        // Получаем текст ответа для отладки
        const responseText = await response.text();
        console.log('Ответ сервера:', responseText);
        
        // Пробуем распарсить JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            throw new Error('Сервер вернул некорректный ответ');
        }
        
        if (!response.ok) {
            throw new Error(result.message || 'Ошибка сервера');
        }
        
        return result;
        
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        
        // Более информативные сообщения об ошибках
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Проблема с соединением. Проверьте интернет и попробуйте снова.');
        }
        
        throw error;
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

console.log('🎯 A.S.K.V.G. Script fully loaded and initialized');