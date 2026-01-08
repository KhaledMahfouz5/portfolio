// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector(this.getAttribute('href')).scrollIntoView({
			behavior: 'smooth'
		});
	});
});

const sections = Array.from(document.querySelectorAll('section'));
const navButton = document.querySelector('.section-nav');
let currentSectionIndex = 0;
navButton.addEventListener('mouseover', () => {
	navButton.textContent = 'Click Me !!';
});

navButton.addEventListener('mouseout', () => {
	updateNavigation();
});

function updateNavigation() {
	navButton.textContent = `Section ${currentSectionIndex + 1}/${sections.length}`;
}

function scrollToNextSection() {
	const nextIndex = (currentSectionIndex + 1) % sections.length;
	sections[nextIndex].scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
	currentSectionIndex = nextIndex;
	updateNavigation();
}

navButton.addEventListener('click', scrollToNextSection);

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			currentSectionIndex = sections.indexOf(entry.target);
			updateNavigation();
		}
	});
}, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));
updateNavigation();

// Banner Section Particle System
function createParticles() {
	const container = document.querySelector('.particles-container');
	const particleCount = window.innerWidth > 768 ? 100 : 50;

	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.className = 'particle';

		// Random properties
		const size = Math.random() * 5 + 2;
		const left = Math.random() * 100;
		const top = Math.random() * 100;
		const delay = Math.random() * -15;
		const duration = 10 + Math.random() * 10;

		particle.style.cssText = `width: ${size}px;height: ${size}px;left: ${left}%;top: ${top}%;animation-delay: ${delay}s;animation-duration: ${duration}s;`;
		container.appendChild(particle);
	}
}

// Initialize particles on load
window.addEventListener('load', createParticles);

// Facts section animation
const factsTitle = document.querySelector('.facts-title');
const factCards = document.querySelectorAll('.fact-card');
const factsObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			// Animate title
			factsTitle.style.opacity = 1;
			factsTitle.style.transform = 'translateY(0)';

			// Animate cards
			factCards.forEach((card, index) => {
				setTimeout(() => {
					card.classList.add('active');
				}, index * 200); // Staggered delay
			});

			// Animate numbers
			const numberElements = document.querySelectorAll('.animate-number');
			numberElements.forEach(element => {
				const target = parseInt(element.dataset.target);
				let current = 0;

				const numberInterval = setInterval(() => {
					current += Math.ceil(target / 50);
					if (current >= target) {
						clearInterval(numberInterval);
						current = target;
					}
					element.textContent = current + (element.dataset.target.endsWith('98') ? '%' : '+');
				}, 30);
			});

			// Stop observing after animation
			factsObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.25 });

factsObserver.observe(document.querySelector('.facts'));

// Enhanced animation for project cards
document.addEventListener('DOMContentLoaded', function() {
	const projectCards = document.querySelectorAll('.project-card');

	// Intersection Observer for scroll animations
	const observerOptions = {
		threshold: 0.2,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver(function(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animationPlayState = 'running';
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	projectCards.forEach(card => {
		// Set animation to paused initially
		card.style.animationPlayState = 'paused';
		observer.observe(card);

		// Enhanced hover effect with slight delay
		card.addEventListener('mouseenter', function() {
			this.style.transform = 'translateY(-10px) scale(1.03)';
		});

		card.addEventListener('mouseleave', function() {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});

	// Parallax effect for the section background
	const projectsSection = document.querySelector('.projects-section');
	window.addEventListener('scroll', function() {
		const scrollPosition = window.pageYOffset;
		if (projectsSection) {
			projectsSection.style.backgroundPosition = `center ${scrollPosition * 0.3}px`;
		}
	});
});

document.addEventListener('DOMContentLoaded', function() {
	const factCards = document.querySelectorAll('.fact-card');
	const numberElements = document.querySelectorAll('.animate-number');

	// Intersection Observer for scroll animations
	const observerOptions = {
		threshold: 0.2,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver(function(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animationPlayState = 'running';

				// Animate numbers if this is a fact card
				if (entry.target.classList.contains('fact-card')) {
					const numberElement = entry.target.querySelector('.animate-number');
					if (numberElement) {
						animateNumber(numberElement);
					}
				}

				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe fact cards
	factCards.forEach(card => {
		card.style.animationPlayState = 'paused';
		observer.observe(card);

		// Enhanced hover effect
		card.addEventListener('mouseenter', function() {
			this.style.transform = 'translateY(-10px) scale(1.02)';
		});

		card.addEventListener('mouseleave', function() {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});

	// Number counting animation
	function animateNumber(element) {
		const target = parseInt(element.dataset.target);
		let current = 0;
		const duration = 2000; // 2 seconds
		const steps = 60; // 60 frames
		const increment = target / steps;
		const stepTime = duration / steps;

		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				clearInterval(timer);
				current = target;
			}
			element.textContent = Math.round(current);
		}, stepTime);
	}

	// Initialize numbers to 0
	numberElements.forEach(element => {
		element.textContent = '0';
	});
});

document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe timeline items
    timelineItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);

        // Enhanced hover effect for the entire timeline item
        const card = item.querySelector('.experience-card');
        const dot = item.querySelector('.experience-dot');
        const connector = item.querySelector('.experience-connector');

        item.addEventListener('mouseenter', function() {
            if (card) card.style.transform = 'translateY(-5px)';
            if (dot) dot.style.transform = 'translateY(-50%) scale(1.2)';
            if (connector) connector.style.width = '40px';
        });

        item.addEventListener('mouseleave', function() {
            if (card) card.style.transform = 'translateY(0)';
            if (dot) dot.style.transform = 'translateY(-50%) scale(1)';
            if (connector) connector.style.width = '30px';
        });
    });
});

// Mobile Menu Toggle
const burgerMenu = document.querySelector('.burger-menu');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link');
const overlay = document.querySelector('.mobile-overlay');
const body = document.body;

// Toggle menu function
function toggleMenu() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('no-scroll');
}

// Open/close menu when burger is clicked
burgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking on overlay
overlay.addEventListener('click', () => {
    toggleMenu();
});

// Close menu when clicking on mobile links and scroll to section
mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Close the menu
        toggleMenu();

        // Get the target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Scroll to the section after a short delay to allow menu to close
        setTimeout(() => {
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    });
});

// Close menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMenu();
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') &&
        !mobileNav.contains(e.target) &&
        !burgerMenu.contains(e.target)) {
        toggleMenu();
    }
});

// Update existing smooth scroll to include mobile links
document.querySelectorAll('.nav-link, .mobile-link').forEach(anchor => {
    // Remove any existing click event listeners to prevent duplicates
    anchor.replaceWith(anchor.cloneNode(true));
});

