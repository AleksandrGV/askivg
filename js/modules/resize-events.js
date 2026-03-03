/**
 * ========== RESIZE EVENTS ==========
 * Обработка изменения размера окна для сайта A.S.K.I.V.G.
 */

export function handleResizeEvents() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Обновление AOS при изменении размера
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
        }, 250);
    });
}

export default {
    handleResizeEvents
};