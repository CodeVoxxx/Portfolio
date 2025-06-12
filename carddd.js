/*
==========================================================================
* @File:        carddd.js
* @Author:      Joshua Limas (Assisted by AI)
* @Version:     3.2.0 (Generic Staggering Logic)
* @Description: A high-end, animation-driven JavaScript engine for a
*               creative portfolio. Built for performance and study.
*               Handles custom cursor, page loading, generic staggered reveals,
*               and complex scroll-triggered animations.
==========================================================================
*/

'use strict';

// -------------------------------------------------------------------------
// MASTER APPLICATION CONTROLLER
// -------------------------------------------------------------------------
const App = {
    // This method is the entry point for all our scripts.
    init() {
        this.cacheDOMElements();
        this.setupEventListeners();
        this.runPageLoader();
        this.createScrollObserver();
    },

    // A central place to store all the DOM elements we'll be interacting with.
    cacheDOMElements() {
        this.DOM = {
            cursor: document.querySelector('.cursor'),
            hoverableElements: document.querySelectorAll('[data-cursor-hover]'),
            loaderGates: document.querySelectorAll('.loader__gate'),
            
            // For generic scroll animations and staggered reveals
            animatedElements: document.querySelectorAll('[data-animation]'),
            
            // For the horizontal scroll animation
            horizontalScrollSection: document.querySelector('.horizontal-scroll-section'),
            scrollContainer: document.querySelector('.scroll-container'),
        };
    },
    
    // Attaches all the necessary event listeners for the page.
    setupEventListeners() {
        // --- Custom Cursor Listeners ---
        window.addEventListener('mousemove', this.handleCursorMove.bind(this));
        this.DOM.hoverableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(this.DOM.cursor) this.DOM.cursor.classList.add('is-hovering')
            });
            el.addEventListener('mouseleave', () => {
                 if(this.DOM.cursor) this.DOM.cursor.classList.remove('is-hovering')
            });
        });
        
        // --- Scroll-based Animations Listener ---
        // This is for the complex horizontal scroll animation.
        window.addEventListener('scroll', () => {
            this.animateHorizontalScroll();
        });
    },

    // -------------------------------------------------------------------------
    // MODULE: Page Loader Animation
    // -------------------------------------------------------------------------
    runPageLoader() {
        document.body.classList.add('is-loading');

        setTimeout(() => {
            this.DOM.loaderGates.forEach(gate => {
                gate.classList.add('is-hidden');
            });

            setTimeout(() => {
                document.body.classList.remove('is-loading');
            }, 1000); // This delay should match the loader__gate transition duration

        }, 500); // Initial delay before the loader animation starts
    },
    
    // -------------------------------------------------------------------------
    // MODULE: Custom Cursor Movement
    // -------------------------------------------------------------------------
    handleCursorMove(e) {
        if (!this.DOM.cursor) return; // Safety check
        // Using translate3d can sometimes provide better performance by hinting GPU acceleration
        this.DOM.cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    },

    // -------------------------------------------------------------------------
    // MODULE: Generic On-Scroll Animations (with STAGGER logic)
    // -------------------------------------------------------------------------
    createScrollObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -150px 0px',
            threshold: 0,
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Check if the element is a container for staggered children
                    if (el.dataset.animation === 'stagger-children') {
                        // ========== JAVASCRIPT CHANGE ==========
                        // This selector is now generic. It selects all direct children
                        // of the staggering container (like .skill-item or .newsletter-card),
                        // making the function reusable for any staggered list.
                        const childrenToStagger = el.querySelectorAll(':scope > *'); 
                        const staggerDelay = parseInt(el.dataset.staggerDelay) || 50;

                        childrenToStagger.forEach((child, index) => {
                            const delay = index * staggerDelay;
                            setTimeout(() => {
                                // Instead of adding a class, we directly set styles
                                // defined in the CSS for the animated items.
                                child.style.opacity = '1';
                                child.style.transform = 'none';
                            }, delay);
                        });
                    } else {
                        // Logic for all other non-staggered animations
                        const delay = parseInt(el.dataset.delay) || 0;
                        setTimeout(() => {
                            el.classList.add('is-visible');
                        }, delay);
                    }
                    
                    // Stop observing the element once it has been animated.
                    observer.unobserve(el);
                }
            });
        }, options);
        
        // Observe all elements that have a [data-animation] attribute.
        this.DOM.animatedElements.forEach(el => observer.observe(el));
    },
    
    // -------------------------------------------------------------------------
    // MODULE: ADVANCED HORIZONTAL SCROLL ANIMATION
    // -------------------------------------------------------------------------
    animateHorizontalScroll() {
        // This function doesn't need changes; it's already adaptive.
        // It works based on the section's total height and the container's scrollable width.
        // Since we increased these in the CSS/HTML, the scroll duration automatically adjusts.
        if (!this.DOM.horizontalScrollSection || !this.DOM.scrollContainer) return;
        
        const section = this.DOM.horizontalScrollSection;
        const rect = section.getBoundingClientRect();
        
        // The animation runs only when the section is "pinned" to the top of the viewport.
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            const scrollableWidth = this.DOM.scrollContainer.scrollWidth - window.innerWidth;
            const scrollProgress = -rect.top / (section.offsetHeight - window.innerHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
            
            const moveX = -clampedProgress * scrollableWidth;
            
            // Using transform directly and will-change in CSS helps ensure smooth animation.
            this.DOM.scrollContainer.style.transform = `translateX(${moveX}px)`;
        }
    },
};

// --- KICKSTART THE APPLICATION ---
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});