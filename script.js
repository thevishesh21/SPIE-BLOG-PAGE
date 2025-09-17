// SPIE Website Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');
    
    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function() {
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchToggle.contains(e.target) && !searchInput.contains(e.target)) {
                searchInput.classList.remove('active');
            }
        });
        
        // Close search on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchInput.classList.contains('active')) {
                searchInput.classList.remove('active');
                searchToggle.focus();
            }
        });
    }
    
    // Article modal functionality
    const modal = document.getElementById('articleModal');
    const ctaButton = document.querySelector('.cta-button');
    const closeButton = document.querySelector('.modal-close');
    
    if (ctaButton && modal) {
        ctaButton.addEventListener('click', function() {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeButton?.focus();
        });
    }
    
    if (closeButton && modal) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            ctaButton?.focus();
        }
    }
    
    // Topic filter functionality
    const chips = document.querySelectorAll('.chip');
    const newsItems = document.querySelectorAll('.news-item');
    
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active chip
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter news items
            newsItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.classList.add('fade-in');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('fade-in');
                }
            });
        });
    });
    
    // Newsletter form functionality
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                showMessage('Please enter your email address.', 'error');
                return;
            }
            
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const button = this.querySelector('.newsletter-button');
            const originalText = button.textContent;
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            this.classList.add('loading');
            
            setTimeout(() => {
                showMessage('Thank you for subscribing! You\'ll receive our weekly digest soon.', 'success');
                emailInput.value = '';
                button.textContent = originalText;
                button.disabled = false;
                this.classList.remove('loading');
            }, 1500);
        });
    }
    
    function showMessage(text, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = text;
            newsletterMessage.className = `newsletter-message ${type}`;
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    newsletterMessage.classList.remove('success');
                    newsletterMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Gallery thumbnail interactions
    const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
    const featuredImage = document.querySelector('.featured-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            if (featuredImage) {
                const newSrc = this.src.replace(/w=150&h=100/, 'w=800&h=600');
                featuredImage.src = newSrc;
                featuredImage.alt = this.alt;
                
                // Add loading animation
                featuredImage.style.opacity = '0.6';
                featuredImage.addEventListener('load', function() {
                    this.style.opacity = '1';
                }, { once: true });
            }
        });
        
        // Make thumbnails keyboard accessible
        thumb.setAttribute('tabindex', '0');
        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('modal-close') && !this.classList.contains('search-toggle')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe news items and trending items for animations
    document.querySelectorAll('.news-item, .trending-item').forEach(item => {
        observer.observe(item);
    });
    
    // Handle touch events for better mobile interaction
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchY;
        
        // Add subtle scroll momentum feel
        if (Math.abs(touchDiff) > 50) {
            document.body.style.scrollBehavior = 'smooth';
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        setTimeout(() => {
            document.body.style.scrollBehavior = '';
        }, 100);
    }, { passive: true });
});

// Utility functions for responsive behavior
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

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Close search input on resize if it's open and we're on mobile
    const searchInput = document.querySelector('.search-input');
    if (searchInput && window.innerWidth <= 768) {
        searchInput.classList.remove('active');
    }
    
    // Adjust modal positioning
    const modal = document.querySelector('.article-modal.active');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent && window.innerHeight < modalContent.offsetHeight + 100) {
            modal.style.alignItems = 'flex-start';
            modal.style.paddingTop = '2rem';
        } else {
            modal.style.alignItems = 'center';
            modal.style.paddingTop = '';
        }
    }
}, 250));