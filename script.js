// Theme Management
const themeManager = {
    init() {
        this.toggleBtn = document.getElementById('themeToggle');
        this.html = document.documentElement;
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.html.setAttribute('data-theme', savedTheme);
        
        this.toggleBtn.addEventListener('click', () => this.toggle());
    },
    
    toggle() {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle transition effect
        this.html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
};

// Navigation Management
const navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for anchor links
        this.initSmoothScroll();
    },
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    handleScroll() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    },
    
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// Scroll Reveal Animation
const scrollReveal = {
    init() {
        this.elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay if specified
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => this.observer.observe(el));
    }
};

// Custom Cursor
const customCursor = {
    init() {
        // Check if touch device
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        
        window.addEventListener('mousemove', (e) => this.move(e));
        
        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .service-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hover'));
        });
    },
    
    move(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Dot follows immediately
        this.cursorDot.style.left = `${posX}px`;
        this.cursorDot.style.top = `${posY}px`;
        
        // Outline follows with delay
        this.cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    }
};

// Form Handling with Web3Forms
const formHandler = {
    init() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.formStatus = document.getElementById('formStatus');
        
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const originalBtnContent = this.submitBtn.innerHTML;
        const formData = new FormData(this.form);
        
        // Set replyto field to the user's email
        const userEmail = formData.get('email');
        this.form.querySelector('input[name="replyto"]').value = userEmail;
        
        // Loading state
        this.submitBtn.innerHTML = '<span>Sending...</span>';
        this.submitBtn.disabled = true;
        this.formStatus.textContent = '';
        this.formStatus.className = 'form-status';
        
        try {
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Success state
                this.submitBtn.innerHTML = '<span>Message Sent!</span>';
                this.submitBtn.style.backgroundColor = 'var(--success)';
                this.formStatus.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
                this.formStatus.className = 'form-status success';
                
                // Reset form
                this.form.reset();
                
                // Reset button after 5 seconds
                setTimeout(() => {
                    this.submitBtn.innerHTML = originalBtnContent;
                    this.submitBtn.disabled = false;
                    this.submitBtn.style.backgroundColor = '';
                    this.formStatus.textContent = '';
                    this.formStatus.className = 'form-status';
                }, 5000);
            } else {
                throw new Error(data.message || 'Failed to send');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Error state
            this.submitBtn.innerHTML = '<span>Failed to Send</span>';
            this.submitBtn.style.backgroundColor = 'var(--error)';
            this.formStatus.textContent = 'Oops! Something went wrong. Please try again or email us directly at hello@nexora.digital';
            this.formStatus.className = 'form-status error';
            
            // Reset button after 5 seconds
            setTimeout(() => {
                this.submitBtn.innerHTML = originalBtnContent;
                this.submitBtn.disabled = false;
                this.submitBtn.style.backgroundColor = '';
                this.formStatus.textContent = '';
                this.formStatus.className = 'form-status';
            }, 5000);
        }
    }
};

// Parallax Effect for Hero Section
const parallax = {
    init() {
        this.hero = document.querySelector('.hero');
        this.orbs = document.querySelectorAll('.gradient-orb');
        
        window.addEventListener('scroll', () => this.handleScroll());
    },
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        this.orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.2;
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
    }
};

// Counter Animation for Stats
const counterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animate();
                    this.animated = true;
                }
            });
        });
        
        if (this.counters.length > 0) {
            observer.observe(this.counters[0].parentElement);
        }
    },
    
    animate() {
        this.counters.forEach(counter => {
            const text = counter.textContent;
            const number = parseInt(text);
            const suffix = text.replace(/[0-9]/g, '');
            const duration = 2000;
            const step = timestamp => {
                if (!counter.start) counter.start = timestamp;
                const progress = timestamp - counter.start;
                const percentage = Math.min(progress / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
                
                counter.textContent = Math.floor(easeOutQuart * number) + suffix;
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        });
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    navigation.init();
    scrollReveal.init();
    customCursor.init();
    formHandler.init();
    parallax.init();
    counterAnimation.init();
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Additional scroll-based animations can go here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Preload critical images or resources
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});