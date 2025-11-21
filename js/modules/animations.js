export class Animations {
    static initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 100
            });
        }
    }

    static refreshAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}
