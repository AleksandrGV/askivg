// /**
//  * ========== RATING STARS ==========
//  * Звездный рейтинг для сайта A.S.K.I.V.G.
//  */

/**
 * Инициализирует звезды рейтинга
 */
export function initRatingStars(projectId) {
    const starsContainer = document.getElementById(`ratingStars-${projectId}`);
    const ratingInput = document.getElementById(`commentRating-${projectId}`);
    const stars = starsContainer?.querySelectorAll('.star');
    
    if (!starsContainer || !ratingInput || !stars) return;
    
    let currentRating = parseInt(ratingInput.value) || 5;
    
    function updateStarsDisplay(rating) {
        stars.forEach((star, index) => {
            if (index + 1 <= rating) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }
    
    updateStarsDisplay(currentRating);
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = parseInt(this.dataset.value);
            ratingInput.value = currentRating;
            updateStarsDisplay(currentRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStarsDisplay(parseInt(this.dataset.value));
        });
    });
    
    starsContainer.addEventListener('mouseleave', () => {
        updateStarsDisplay(currentRating);
    });
}

/**
 * Сбрасывает звезды рейтинга
 */
export function resetRatingStars(projectId) {
    const ratingInput = document.getElementById(`commentRating-${projectId}`);
    if (ratingInput) {
        ratingInput.value = '5';
        const stars = document.querySelectorAll(`#ratingStars-${projectId} .star`);
        stars.forEach((star, index) => {
            if (index + 1 <= 5) {
                star.textContent = '★';
                star.classList.add('active');
            }
        });
    }
}

// Единый экспорт по умолчанию
export default {
    initRatingStars,
    resetRatingStars
};