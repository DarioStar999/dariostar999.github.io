// GSAP animations
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Feature cards animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        const delay = parseFloat(card.getAttribute('data-delay') || '0');
        
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: delay,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Mod showcase animations
    const modItems = document.querySelectorAll('.mod-item');
    modItems.forEach((item, index) => {
        const isLeft = item.classList.contains('left');
        const content = item.querySelector('.mod-content');
        const image = item.querySelector('.mod-image');
        
        gsap.from(content, {
            opacity: 0,
            x: isLeft ? 50 : -50,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from(image, {
            opacity: 0,
            x: isLeft ? -50 : 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Download CTA animation
    const downloadCta = document.querySelector('.download-cta');
    if (downloadCta) {
        const title = downloadCta.querySelector('.download-title');
        const description = downloadCta.querySelector('.download-description');
        const buttons = downloadCta.querySelector('.download-buttons');
        const links = downloadCta.querySelector('.download-links');
        
        gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: downloadCta,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from(description, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: 0.1,
            scrollTrigger: {
                trigger: downloadCta,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from(buttons, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: 0.2,
            scrollTrigger: {
                trigger: downloadCta,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from(links, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: 0.3,
            scrollTrigger: {
                trigger: downloadCta,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    }
    
    // Hero section parallax effect
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
});