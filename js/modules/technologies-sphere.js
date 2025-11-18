import { technologiesData } from './config.js';

export class TechnologiesSphere {
    constructor() {
        this.sphere = document.querySelector('.technologies__sphere-3d');
        this.technologiesSphereWrap = document.querySelector('.technologies__sphere-wrapper');
        this.technologiesPoints = document.querySelectorAll('.technologies__sphere-point');
        this.technologiesInfo = document.getElementById('technologiesInfo');
        this.technologiesInfoTitle = document.getElementById('technologiesInfoTitle');
        this.technologiesInfoText = document.getElementById('technologiesInfoText');

        this.sphereRadius = 220;
        this.technologiesStates = new Map();
        this.animationId = null;
        this.isAnimation = true;
    }

    init() {
        if (!this.sphere) {return;}
        
        this.initializeTechnologiesPositions();
        this.setupEventListeners();
        this.startAnimation();
    }

    initializeTechnologiesPositions() {
        this.technologiesPoints.forEach((point, index) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 200;
            const depth = (Math.random() - 0.5) * 100;

            const position = {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                z: depth,
                angle: angle,
                distance: distance,
                depth: depth
            };

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

    updateTechnologiesPosition(point) {
        const state = this.technologiesStates.get(point);
        if (!state) {return;}

        const { position } = state;
        const depthFactor = (position.z + 50) / 100;
        const scale = 0.7 + depthFactor * 0.6;
        const opacity = 0.6 + depthFactor * 0.4;
        
        const transform = `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`;

        point.style.transform = transform;
        point.style.opacity = opacity;
        point.style.zIndex = Math.round(50 + position.z);
    }

    animateTechnologiesMovement() {
        if (!this.isAnimation) {return;}

        this.technologiesPoints.forEach(point => {
            const state = this.technologiesStates.get(point);
            if (!state || state.isHovered) {return;}

            const { position, velocity } = state;

            position.angle += velocity.angle;
            position.distance += velocity.distance;
            position.z += velocity.depth;

            if (position.distance < 50) {
                position.distance = 50;
                velocity.distance *= -1;
            }

            if (position.distance > this.sphereRadius - 50) {
                position.distance = this.sphereRadius - 50;
                velocity.distance *= -1;
            }

            if (position.z < -50) {
                position.z = -50;
                velocity.depth *= -1;
            }
            if (position.z > 50) {
                position.z = 50;
                velocity.depth *= -1;
            }

            position.x = Math.cos(position.angle) * position.distance;
            position.y = Math.sin(position.angle) * position.distance;

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
                if (state) {state.isHovered = true;}

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
                if (state) {state.isHovered = false;}

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