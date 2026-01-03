// ========================================
// GLOBAL VARIABLES
// ========================================

let currentProjectIndex = 0;
let isAutoPlaying = true;
let autoPlayInterval;

// Projects Data
const projects = [
    {
        title: 'Conversational AI Chat Application',
        description: 'Built a full-stack AI chat application using Django REST Framework (backend) and React.js (frontend). Implemented JWT-based authentication and integrated Google Gemini API for intelligent, context-aware conversations. Designed RESTful APIs for user management and chat operations with optimized PostgreSQL queries.',
        techStack: ['Django REST Framework', 'React.js', 'PostgreSQL', 'JWT', 'Google Gemini API', 'Redux Toolkit'],
        github: 'https://github.com/Sudharson-B/AI-Chat-Application',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        title: 'Django Blog Platform',
        description: 'Developed a full-featured blog application with SQLite database integration. Implemented post management, categories, SEO-friendly slugs, and related posts functionality. Built a responsive UI with pagination, form validation, and customized Django admin panel for content management.',
        techStack: ['Python', 'Django', 'SQLite', 'Bootstrap', 'JavaScript', 'HTML/CSS'],
        github: 'https://github.com/Sudharson-B/blog',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        title: 'Personal Portfolio Website',
        description: 'Designed and developed a responsive personal portfolio website to showcase projects, technical skills, and GitHub work. Implemented dynamic project rendering using JavaScript, reusable UI components with Bootstrap, and custom styling with CSS. Ensured cross-device compatibility and clean navigation.',
        techStack: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
        github: 'https://github.com/Sudharson-B/portfolio',
        gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'

    },

    {
        title: 'Weather API Application',
        description: 'Built a Django REST Framework application that fetches real-time weather data from external APIs. Implemented efficient API integration, data parsing, and error handling. Created a clean, responsive frontend to display weather information with location-based search functionality.',
        techStack: ['Django REST Framework', 'Python', 'External APIs', 'JavaScript', 'HTML/CSS'],
        github: 'https://github.com/Sudharson-B/weather_api',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
    
];

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active section
    updateActiveSection();
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

mobileMenuToggle.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');

    if (mobileMenu.classList.contains('open')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Close mobile menu if open
    if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Update active section in navigation
function updateActiveSection() {
    const sections = ['home', 'about', 'education', 'skills', 'internships', 'projects', 'certificates', 'contact'];
    const scrollPosition = window.scrollY + 150;

    for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                // Update all nav links
                document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === section) {
                        link.classList.add('active');
                    }
                });
                break;
            }
        }
    }
}

// ========================================
// PROJECTS CAROUSEL
// ========================================

function renderProjects() {
    const slider = document.getElementById('projectsSlider');
    const dotsContainer = document.getElementById('carouselDots');

    // Clear existing content
    slider.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Calculate visible projects (3 at a time, circular)
    const visibleProjects = [];
    for (let i = 0; i < 3; i++) {
        const index = (currentProjectIndex + i) % projects.length;
        visibleProjects.push({ ...projects[index], originalIndex: index });
    }

    // Render project cards
    visibleProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${index === 0 ? 'active' : ''}`;
        projectCard.style.background = project.gradient;

        const techBadges = project.techStack.map(tech =>
            `<span class="tech-badge">${tech}</span>`
        ).join('');

        const githubLink = project.github !== '#' ?
            `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i data-lucide="github"></i>
                View Code
            </a>` : '';

        projectCard.innerHTML = `
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                
                <div class="project-tech">
                    ${techBadges}
                </div>

                <div class="project-links">
                    ${githubLink}
                </div>
            </div>
        `;

        slider.appendChild(projectCard);
    });

    // Render dots
    projects.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === currentProjectIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => goToProject(index));
        dotsContainer.appendChild(dot);
    });

    // Re-initialize Lucide icons
    lucide.createIcons();
}

function nextProject() {
    stopAutoPlay();
    currentProjectIndex = (currentProjectIndex + 1) % projects.length;
    renderProjects();
}

function prevProject() {
    stopAutoPlay();
    currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
    renderProjects();
}

function goToProject(index) {
    stopAutoPlay();
    currentProjectIndex = index;
    renderProjects();
}

function stopAutoPlay() {
    isAutoPlaying = false;
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

function startAutoPlay() {
    if (isAutoPlaying) {
        autoPlayInterval = setInterval(() => {
            currentProjectIndex = (currentProjectIndex + 1) % projects.length;
            renderProjects();
        }, 5000);
    }
}

// Event listeners for carousel buttons
document.getElementById('prevBtn').addEventListener('click', prevProject);
document.getElementById('nextBtn').addEventListener('click', nextProject);

// ========================================
// CONTACT FORM
// ========================================

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Show success message
    alert('Thank you for your message! This is a demo form. In a production environment, this would send your message.');

    // Reset form
    contactForm.reset();
});

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Initialize projects carousel
    renderProjects();
    startAutoPlay();

    // Initialize Lucide icons
    lucide.createIcons();

    // Update active section on load
    updateActiveSection();
});

// ========================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const sectionId = href.substring(1);
            scrollToSection(sectionId);
        }
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});
