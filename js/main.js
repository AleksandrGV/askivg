const { Preloader } = require('./modules/preloader.js');
const { Navigation } = require('./modules/navigation.js');
const { Animations } = require('./modules/animations.js');
const { TechnologiesSphere } = require('./modules/technologies-sphere.js');
const { Portfolio } = require('./modules/portfolio.js');
const { ProjectModal } = require('./modules/modal.js');
const { Sliders } = require('./modules/sliders.js');
const { CommentSystem } = require('./modules/comments.js');
const { Forms } = require('./modules/forms.js');
const { SmoothScroll } = require('./modules/utils.js');
const { ScrollManager } = require('./modules/scroll-effects.js');

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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.projectModal.close();
            }
        });

        window.openProjectModal = (projectId) => this.projectModal.open(projectId);
        window.closeProjectModal = () => this.projectModal.close();
    }
}

const app = new App();
app.init();