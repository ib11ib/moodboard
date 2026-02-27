// Mobile menu toggle
function toggleMobileMenu() {
    const navTabs = document.getElementById('navTabs');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navTabs.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Close mobile menu when clicking on a tab
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Close mobile menu if open
    const navTabs = document.getElementById('navTabs');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (navTabs.classList.contains('active')) {
        navTabs.classList.remove('active');
        menuToggle.classList.remove('active');
    }
    
    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navTabs = document.getElementById('navTabs');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navTabs && navTabs.classList.contains('active')) {
        if (!navTabs.contains(event.target) && !menuToggle.contains(event.target)) {
            navTabs.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

// Shopping/Packing list save/load functionality
function saveCheckList(storageKey) {
    const checkboxes = document.querySelectorAll('.item-checkbox, .packing-item .item-checkbox');
    const states = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem(storageKey || 'checkListStates', JSON.stringify(states));
    
    checkboxes.forEach((checkbox) => {
        const item = checkbox.closest('.shopping-item, .packing-item');
        if (item) {
            if (checkbox.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
        }
    });
}

// Alias for shopping list (backwards compatible)
function saveShoppingList() {
    saveCheckList('shoppingListStates');
}

// Alias for packing list
function savePackingList() {
    saveCheckList('packingListStates');
}

function loadCheckList(storageKey) {
    const saved = localStorage.getItem(storageKey || 'checkListStates');
    if (saved) {
        const states = JSON.parse(saved);
        const checkboxes = document.querySelectorAll('.item-checkbox, .packing-item .item-checkbox');
        checkboxes.forEach((checkbox, index) => {
            if (states[index]) {
                checkbox.checked = true;
                const item = checkbox.closest('.shopping-item, .packing-item');
                if (item) item.classList.add('checked');
            }
        });
    }
}

function loadShoppingList() { loadCheckList('shoppingListStates'); }
function loadPackingList() { loadCheckList('packingListStates'); }

// Load on page start
window.addEventListener('DOMContentLoaded', function() {
    // Load appropriate list based on page
    const isVacation = document.body.classList.contains('vacation-page');
    if (isVacation) {
        loadPackingList();
    } else {
        loadShoppingList();
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll(
        '.makeup-step, .hairstyle-card, .outfit-card, .shopping-category, .mistake-card, ' +
        '.colortype-card, .vacation-card, .packing-category'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// Swipe navigation for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const activeTab = document.querySelector('.nav-tab.active');
        if (!activeTab) return;
        const allTabs = Array.from(document.querySelectorAll('button.nav-tab'));
        const currentIndex = allTabs.indexOf(activeTab);
        
        if (diff > 0 && currentIndex > 0) {
            allTabs[currentIndex - 1].click();
        } else if (diff < 0 && currentIndex < allTabs.length - 1) {
            allTabs[currentIndex + 1].click();
        }
    }
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Page load animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});
