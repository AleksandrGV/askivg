/**
 * ========== TECHNOLOGIES SPHERE ==========
 * 3D сфера технологий для сайта A.S.K.I.V.G.
 */

import { TECHNOLOGIES_DATA } from './constants.js';

export class TechnologiesSphere {
    constructor() {
        this.sphere = document.querySelector('.technologies__sphere-3d');
        this.technologiesPoints = document.querySelectorAll('.technologies__sphere-point');
        this.technologiesInfo = document.getElementById('technologiesInfo');
        this.technologiesInfoTitle = document.getElementById('technologiesInfoTitle');
        this.technologiesInfoText = document.getElementById('technologiesInfoText');

        this.sphereRadius = 220; // Радиус диска
        this.technologiesStates = new Map(); // Создание коллекции
        this.animationId = null;
        this.isAnimation = true;

        if (this.sphere && this.technologiesPoints.length > 0) {
            this.init();
        }
    }

    init() {
        this.initializeTechnologiesPositions();
        this.setupEventListeners();
        this.startAnimation();
    }

    // Инициализация случайных позиций
    initializeTechnologiesPositions() {
        this.technologiesPoints.forEach((point, index) => {
            const angle = Math.random() * Math.PI * 2;
            let distance = 50 + Math.random() * 200; // От 50px до 200px от центра
            const depth = (Math.random() - 0.5) * 100; // Глубина от -50px до 50px

            const position = {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                z: depth,
                angle: angle,
                distance: distance,
                depth: depth
            };

            // Случайная скорость движения
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

        // Эффект объема в зависимости от глубины
        const depthFactor = (position.z + 50) / 100; // от 0 до 1
        const scale = 0.7 + depthFactor * 0.6; // Масштаб от 0,7 до 1,3
        const opacity = 0.6 + depthFactor * 0.4; // Прозрачность от 0,6 до 1
        
        const transform = `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`;

        point.style.transform = transform;
        point.style.opacity = opacity;
        point.style.zIndex = Math.round(50 + position.z);
    }

    // Анимация случайного движения технологий
    animateTechnologiesMovement() {
        if (!this.isAnimation) return;

        this.technologiesPoints.forEach(point => {
            const state = this.technologiesStates.get(point);
            if (!state || state.isHovered) return;

            const { position, velocity } = state;

            // Обновляем позицию
            position.angle += velocity.angle;
            position.distance += velocity.distance;
            position.z += velocity.depth;

            // Ограничиваем расстояние от центра
            if (position.distance < 50) {
                position.distance = 50;
                velocity.distance *= -1;
            }

            if (position.distance > this.sphereRadius - 50) {
                position.distance = this.sphereRadius - 50;
                velocity.distance *= -1;
            }

            // ограничиваем глубину
            if (position.z < -50) {
                position.z = -50;
                velocity.depth *= -1;
            }
            if (position.z > 50) {
                position.z = 50;
                velocity.depth *= -1;
            }

            // Обновляем координаты
            position.x = Math.cos(position.angle) * position.distance;
            position.y = Math.sin(position.angle) * position.distance;

            // Случайное изменение скорости
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

    // Главный анимационный цикл
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

                // Останавливаем движение диска и движение технологий
                this.sphere.classList.add('paused');
                this.stopAnimation();

                const tech = point.getAttribute('data-tech');
                if (TECHNOLOGIES_DATA[tech]) {
                    this.technologiesInfoTitle.textContent = TECHNOLOGIES_DATA[tech].title;
                    this.technologiesInfoText.textContent = TECHNOLOGIES_DATA[tech].text;
                    this.technologiesInfo.classList.add('active');
                }

                point.style.zIndex = '1000';
            });

            point.addEventListener('mouseleave', (e) => {
                const state = this.technologiesStates.get(point);
                if (state) state.isHovered = false;

                // Вообновляем движение диска и технологий
                this.sphere.classList.remove('paused');
                this.startAnimation();
                if (state) {
                    point.style.zIndex = Math.round(50 + state.position.z);
                }

                setTimeout(() => {
                    if (!this.technologiesInfo.matches(':hover')) {
                        this.technologiesInfo.classList.remove('active');
                    }
                }, 300);
            });

            point.addEventListener('click', (e) => {
                const tech = point.getAttribute('data-tech');
                if (TECHNOLOGIES_DATA[tech]) {
                    this.technologiesInfoTitle.textContent = TECHNOLOGIES_DATA[tech].title;
                    this.technologiesInfoText.textContent = TECHNOLOGIES_DATA[tech].text;
                    this.technologiesInfo.classList.add('active');
                    this.sphere.classList.add('paused');
                    this.stopAnimation();
                }
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
            this.startAnimation();
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

/**
 * Инициализация технологий
 * ЭТА ФУНКЦИЯ НУЖНА ДЛЯ MAIN.JS
 */
export function initTechnologies() {
    // Проверяем, есть ли элементы технологий на странице
    if (document.querySelector('.technologies__sphere-3d')) {
        const technologiesSphere = new TechnologiesSphere();
        return technologiesSphere;
    } else {
        return null;
    }
}

// Для обратной совместимости
export function initTechnologiesSphere() {
    return initTechnologies();
}

// Единый экспорт по умолчанию
export default {
    TechnologiesSphere,
    initTechnologies,
    initTechnologiesSphere
};