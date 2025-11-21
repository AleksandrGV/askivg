import * as THREE from 'three';
import { technologiesData } from './config.js';

/**
 * Класс для создания интерактивной 3D сферы технологий
 * Объединяет CSS 3D трансформации с Three.js для визуальных эффектов
 */
export class TechnologiesSphere {
    constructor() {
        // DOM элементы
        this.sphere = document.querySelector('.technologies__sphere-3d');
        this.technologiesPoints = document.querySelectorAll('.technologies__sphere-point');
        this.technologiesSphereWrap = document.querySelector('.technologies__sphere-wrapper');
        this.technologiesInfo = document.getElementById('technologiesInfo');
        this.technologiesInfoTitle = document.getElementById('technologiesInfoTitle');
        this.technologiesInfoText = document.getElementById('technologiesInfoText');

        // Three.js компоненты
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        
        // Параметры анимации
        this.sphereRadius = 220;
        this.technologiesStates = new Map();
        this.animationId = null;
        this.isAnimation = true;
        
        // Three.js параметры
        this.threeSceneActive = false;
        this.particleSystem = null;

        // Инициализация компонентов
        this.init();
        this.initThreeJS();
    }

    /**
     * Инициализация Three.js сцены для дополнительных визуальных эффектов
     */
    initThreeJS() {
        // Проверяем доступность контейнера
        if (!this.sphere) {
            return;
        }

        try {
            // Создание сцены
            this.scene = new THREE.Scene();
            
            // Создание камеры
            const width = this.sphere.clientWidth || 300;
            const height = this.sphere.clientHeight || 300;
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 5;

            // Создание рендерера
            this.renderer = new THREE.WebGLRenderer({ 
                alpha: true,
                antialias: true 
            });
            this.renderer.setSize(width, height);
            this.renderer.setClearColor(0x000000, 0); // Прозрачный фон

            // Создание частиц для фонового эффекта
            this.createBackgroundParticles();
            
            // Добавление рендерера в контейнер
            this.sphere.appendChild(this.renderer.domElement);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.zIndex = '1';
            this.renderer.domElement.style.pointerEvents = 'none'; // Пропускаем события мыши

            this.threeSceneActive = true;
            this.animateThreeJS();
            
        } catch (error) {
            // Three.js не критичен для работы компонента
            this.threeSceneActive = false;
        }
    }

    /**
     * Создает фоновые частицы для визуального эффекта
     */
    createBackgroundParticles() {
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Создание геометрии частиц
        const geometry = new THREE.BufferGeometry();

        for (let i = 0; i < particleCount; i++) {
            // Случайные позиции в сферических координатах
            const radius = 2 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Случайные цвета с преобладанием синих и оранжевых оттенков
            const color = new THREE.Color();
            if (Math.random() > 0.5) {
                color.setHSL(0.6, 0.8, 0.6); // Синий
            } else {
                color.setHSL(0.1, 0.9, 0.6); // Оранжевый
            }
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Случайные размеры
            sizes[i] = Math.random() * 0.1 + 0.05;
        }

        // Установка атрибутов геометрии
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Создание материала частиц
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });

        // Создание системы частиц
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    /**
     * Анимация Three.js сцены
     */
    animateThreeJS() {
        if (!this.threeSceneActive || !this.isAnimation) {
            return;
        }

        // Медленное вращение частиц
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x += 0.0005;
        }

        // Рендеринг сцены
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }

        // Продолжение анимации
        requestAnimationFrame(() => this.animateThreeJS());
    }

    /**
     * Основная инициализация компонента
     */
    init() {
        if (!this.sphere) {
            return;
        }
        
        this.initializeTechnologiesPositions();
        this.setupEventListeners();
        this.startAnimation();
    }

    /**
     * Инициализация случайных позиций для технологий
     */
    initializeTechnologiesPositions() {
        this.technologiesPoints.forEach((point) => {
            // Генерация случайных сферических координат
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

            // Начальные скорости движения
            const velocity = {
                angle: (Math.random() - 0.5) * 0.02,
                distance: (Math.random() - 0.5) * 0.8,
                depth: (Math.random() - 0.5) * 0.5
            };

            // Сохранение состояния технологии
            this.technologiesStates.set(point, {
                position: position,
                velocity: velocity,
                isHovered: false
            });

            this.updateTechnologiesPosition(point);
        });
    }

    /**
     * Обновление позиции технологии с учетом глубины
     * @param {HTMLElement} point - Элемент технологии
     */
    updateTechnologiesPosition(point) {
        const state = this.technologiesStates.get(point);
        if (!state) {
            return;
        }

        const { position } = state;
        
        // Расчет эффектов на основе глубины
        const depthFactor = (position.z + 50) / 100;
        const scale = 0.7 + depthFactor * 0.6;
        const opacity = 0.6 + depthFactor * 0.4;
        
        // Применение 3D трансформации
        const transform = `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`;

        point.style.transform = transform;
        point.style.opacity = opacity;
        point.style.zIndex = Math.round(50 + position.z);
    }

    /**
     * Анимация движения технологий
     */
    animateTechnologiesMovement() {
        if (!this.isAnimation) {
            return;
        }

        this.technologiesPoints.forEach(point => {
            const state = this.technologiesStates.get(point);
            if (!state || state.isHovered) {
                return;
            }

            const { position, velocity } = state;

            // Обновление позиции на основе скорости
            position.angle += velocity.angle;
            position.distance += velocity.distance;
            position.z += velocity.depth;

            // Ограничение расстояния от центра
            if (position.distance < 50) {
                position.distance = 50;
                velocity.distance *= -1;
            }

            if (position.distance > this.sphereRadius - 50) {
                position.distance = this.sphereRadius - 50;
                velocity.distance *= -1;
            }

            // Ограничение глубины
            if (position.z < -50) {
                position.z = -50;
                velocity.depth *= -1;
            }
            if (position.z > 50) {
                position.z = 50;
                velocity.depth *= -1;
            }

            // Пересчет декартовых координат
            position.x = Math.cos(position.angle) * position.distance;
            position.y = Math.sin(position.angle) * position.distance;

            // Случайное изменение скоростей для естественного движения
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

    /**
     * Главный цикл анимации
     */
    animate() {
        this.animateTechnologiesMovement();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Запуск анимации
     */
    startAnimation() {
        this.isAnimation = true;
        if (!this.animationId) {
            this.animate();
        }
    }

    /**
     * Остановка анимации
     */
    stopAnimation() {
        this.isAnimation = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        this.setupPointEventListeners();
        this.setupInfoEventListeners();
        this.setupGlobalEventListeners();
    }

    /**
     * Настройка обработчиков для точек технологий
     */
    setupPointEventListeners() {
        this.technologiesPoints.forEach(point => {
            // Обработчик наведения курсора
            point.addEventListener('mouseenter', () => {
                this.handlePointHoverStart(point);
            });

            // Обработчик ухода курсора
            point.addEventListener('mouseleave', () => {
                this.handlePointHoverEnd(point);
            });

            // Обработчик клика
            point.addEventListener('click', () => {
                this.handlePointClick(point);
            });
        });
    }

    /**
     * Обработка начала наведения на точку
     * @param {HTMLElement} point - Элемент технологии
     */
    handlePointHoverStart(point) {
        const state = this.technologiesStates.get(point);
        if (state) {
            state.isHovered = true;
        }

        // Визуальные эффекты при наведении
        this.sphere.classList.add('paused');
        this.stopAnimation();

        // Показ информации о технологии
        const tech = point.getAttribute('data-tech');
        this.showTechnologyInfo(tech);

        // Поднятие элемента на передний план
        point.style.zIndex = '1000';
    }

    /**
     * Обработка окончания наведения на точку
     * @param {HTMLElement} point - Элемент технологии
     */
    handlePointHoverEnd(point) {
        const state = this.technologiesStates.get(point);
        if (state) {
            state.isHovered = false;
        }

        // Возобновление анимации
        this.sphere.classList.remove('paused');
        this.startAnimation();
        
        // Восстановление нормального z-index
        if (state) {
            point.style.zIndex = Math.round(50 + state.position.z);
        }

        // Задержка перед скрытием информации (если не наведен на info блок)
        setTimeout(() => {
            if (!this.technologiesInfo.matches(':hover')) {
                this.technologiesInfo.classList.remove('active');
            }
        }, 300);
    }

    /**
     * Обработка клика по точке
     * @param {HTMLElement} point - Элемент технологии
     */
    handlePointClick(point) {
        const tech = point.getAttribute('data-tech');
        this.technologiesInfoTitle.textContent = technologiesData[tech].title;
        this.technologiesInfoText.textContent = technologiesData[tech].text;
        this.technologiesInfo.classList.add('active');
        this.sphere.classList.add('paused');
        this.stopAnimation();
    }

    /**
     * Показ информации о технологии
     * @param {string} techKey - Ключ технологии
     */
    showTechnologyInfo(techKey) {
        if (technologiesData[techKey]) {
            this.technologiesInfoTitle.textContent = technologiesData[techKey].title;
            this.technologiesInfoText.textContent = technologiesData[techKey].text;
            this.technologiesInfo.classList.add('active');
        }
    }

    /**
     * Настройка обработчиков для блока информации
     */
    setupInfoEventListeners() {
        if (!this.technologiesInfo) {
            return;
        }

        // Наведение на блок информации
        this.technologiesInfo.addEventListener('mouseenter', () => {
            this.technologiesInfo.classList.add('active');
            this.sphere.classList.add('paused');
            this.stopAnimation();
        });

        // Уход с блока информации
        this.technologiesInfo.addEventListener('mouseleave', () => {
            this.technologiesInfo.classList.remove('active');
            this.sphere.classList.remove('paused');
            this.startAnimation();
        });
    }

    /**
     * Настройка глобальных обработчиков событий
     */
    setupGlobalEventListeners() {
        // Закрытие информации при клике вне элементов
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.technologies__sphere-point') && 
                !e.target.closest('.technologies-info')) {
                this.technologiesInfo.classList.remove('active');
                this.sphere.classList.remove('paused');
                this.startAnimation();
            }
        });
    }

    /**
     * Очистка ресурсов при уничтожении компонента
     */
    dispose() {
        this.stopAnimation();
        
        // Очистка Three.js ресурсов
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        
        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
    }
}
