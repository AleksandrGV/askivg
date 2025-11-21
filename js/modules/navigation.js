export class Navigation {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navList = document.querySelector('.nav__list');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.nav = document.querySelector('.nav');
        this.lastScrollTop = 0;
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    setupMobileMenu() {
        if (this.navToggle && this.navList) {
            this.navToggle.addEventListener('click', () => {
                this.navToggle.classList.toggle('active');
                this.navList.classList.toggle('active');
            });
        }
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle?.classList.remove('active');
                this.navList?.classList.remove('active');
            });
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (this.nav) {
                if (scrollTop > 100) {
                    this.nav.style.background = 'rgba(255, 255, 255, 0.95)';
                    this.nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                } else {
                    this.nav.style.background = 'rgba(255, 255, 255, 0.95)';
                    this.nav.style.boxShadow = 'none';
                }
            }
            
            this.lastScrollTop = scrollTop;
        });
    }

    updateActiveNavLink() {
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
}
