import { Preloader } from './modules/preloader.js';
import { Navigation } from './modules/navigation.js';
import { Animations } from './modules/animations.js';
import { TechnologiesSphere } from './modules/technologies-sphere.js';
import { Portfolio } from './modules/portfolio.js';
import { ProjectModal } from './modules/modal.js';
import { Sliders } from './modules/sliders.js';
import { CommentSystem } from './modules/comments.js';
import { Forms } from './modules/forms.js';
import { SmoothScroll } from './modules/utils.js';
import { ScrollManager } from './modules/scroll-effects.js';

class App {
    constructor() {
        this.preloader = new Preloader();
        this.navigation = new Navigation();
        this.technologiesSphere = new TechnologiesSphere();
        this.portfolio = new Portfolio();
        this.sliders = new Sliders();
        this.commentSystem = new CommentSystem();
        this.forms = new Forms();
        this.scrollManager = new ScrollManager(this.sliders);
        this.projectModal = new ProjectModal();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
            this.setupGlobalHandlers();
        });
    }

    initializeComponents() {
        this.preloader.init();
        this.navigation.init();
        Animations.initAOS();
        this.technologiesSphere.init();
        this.portfolio.init();
        this.sliders.initTestimonialSlider();
        this.forms.initContactForm();
        SmoothScroll.init();
        this.scrollManager.init();
        this.commentSystem.initTestimonialForm();
        this.commentSystem.loadRecentComments(20);
    }

    setupGlobalHandlers() {
        // Глобальные обработчики
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.projectModal.close();
            }
        });

        // Экспорт глобальных функций
        window.openProjectModal = (projectId) => this.projectModal.open(projectId);
        window.closeProjectModal = () => this.projectModal.close();
    }
}

// Запуск приложения
const app = new App();
app.init();