import { CONFIG } from './config.js';
import { Animations } from './animations.js';

export class Portfolio {
    constructor() {
        this.filterButtons = document.querySelectorAll('.portfolio__filter');
        this.portfolioItems = document.querySelectorAll('.portfolio__item');
    }

    init() {
        this.setupFilters();
    }

    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                this.filterButtons.forEach(btn => btn.classList.remove('portfolio__filter--active'));
                button.classList.add('portfolio__filter--active');
                
                this.filterItems(filter);
                CONFIG.currentFilter = filter;
            });
        });
    }

    filterItems(filter) {
        this.portfolioItems.forEach(item => {
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
        
        setTimeout(() => {
            Animations.refreshAOS();
        }, 350);
    }
}