// Main JavaScript file

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

mobileMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const featuresSection = document.querySelector('#features');
        if (featuresSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = featuresSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation
document.querySelectorAll('.section-header, .feature-card, .mod-item, .download-content').forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
});