export class Sliders {
    constructor() {
        this.testimonialSwiper = null;
    }

    initTestimonialSlider() {
        if (typeof Swiper === 'undefined') {return;}
        
        const testimonialSliderElement = document.querySelector('.testimonials__slider');
        if (!testimonialSliderElement) {return;}
        
        this.testimonialSwiper = new Swiper(testimonialSliderElement, {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.testimonials__pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.testimonials__nav--next',
                prevEl: '.testimonials__nav--prev'
            },
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            breakpoints: {
                768: {
                    slidesPerView: 1,
                    spaceBetween: 40
                }
            }
        });
    }

    update() {
        if (this.testimonialSwiper) {
            this.testimonialSwiper.update();
        }
    }
}