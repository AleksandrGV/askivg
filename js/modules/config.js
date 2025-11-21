// Глобальные константы и конфигурация
export const CONFIG = {
    isPreloaderActive: true,
    currentFilter: '*'
};

export const mediaQuery = {
    desktop: window.matchMedia('(min-width: 480px)'),
    mobile: window.matchMedia('(max-width: 479px)')
};

// Данные проектов для модальных окон
export const projectData = {
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

//Описание технологий
export const technologiesData = {
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
