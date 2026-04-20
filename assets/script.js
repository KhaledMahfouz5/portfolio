const body = document.body;
const burgerMenu = document.querySelector('.burger-menu');
const mobileNav = document.querySelector('.mobile-nav');
const overlay = document.querySelector('.mobile-overlay');
let particleResizeTimer;

function openMenu() {
	if (!burgerMenu || !mobileNav || !overlay) return;
	burgerMenu.classList.add('active');
	mobileNav.classList.add('active');
	overlay.classList.add('active');
	body.classList.add('no-scroll');
}

function closeMenu() {
	if (!burgerMenu || !mobileNav || !overlay) return;
	burgerMenu.classList.remove('active');
	mobileNav.classList.remove('active');
	overlay.classList.remove('active');
	body.classList.remove('no-scroll');
}

function isMenuOpen() {
	return !!mobileNav && mobileNav.classList.contains('active');
}

function createParticles() {
	const container = document.querySelector('.particles-container');
	if (!container) return;

	container.innerHTML = '';
	const particleCount = window.innerWidth > 768 ? 100 : 50;

	for (let i = 0; i < particleCount; i += 1) {
		const particle = document.createElement('div');
		particle.className = 'particle';

		const size = Math.random() * 5 + 2;
		const left = Math.random() * 100;
		const top = Math.random() * 100;
		const delay = Math.random() * -15;
		const duration = 10 + Math.random() * 10;

		particle.style.cssText = `width:${size}px;height:${size}px;left:${left}%;top:${top}%;animation-delay:${delay}s;animation-duration:${duration}s;`;
		container.appendChild(particle);
	}
}

function setupSmoothScroll() {
	const header = document.querySelector('.header');
	const hashLinks = document.querySelectorAll('a[href^="#"]');
	hashLinks.forEach(anchor => {
		anchor.addEventListener('click', event => {
			const targetId = anchor.getAttribute('href');
			if (!targetId || targetId === '#') return;

			const target = document.querySelector(targetId);
			if (!target) return;

			event.preventDefault();
			const scrollToTarget = () => {
				if (targetId === '#banner') {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				} else {
					const headerOffset = header ? header.offsetHeight : 0;
					const markerTop = target.getBoundingClientRect().top + window.pageYOffset;
					const viewportHeight = window.innerHeight;
					const maxScroll = document.documentElement.scrollHeight - viewportHeight;
					const targetPosition = Math.max(0, Math.min(maxScroll, markerTop - headerOffset + 1));
					window.scrollTo({ top: targetPosition, behavior: 'smooth' });
				}

				if (window.history.pushState) {
					window.history.pushState(null, '', targetId);
				} else {
					window.location.hash = targetId;
				}
			};

			if (anchor.classList.contains('mobile-link') && isMenuOpen()) {
				closeMenu();
				window.requestAnimationFrame(scrollToTarget);
				return;
			}

			scrollToTarget();
		});
	});
}

function setupProjectAnimations() {
	const projectCards = document.querySelectorAll('.project-card');
	if (projectCards.length === 0) return;

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animationPlayState = 'running';
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

	projectCards.forEach(card => {
		card.style.animationPlayState = 'paused';
		observer.observe(card);
	});

	const projectsSection = document.querySelector('.projects-section');
	if (projectsSection) {
		window.addEventListener('scroll', () => {
			const scrollPosition = window.pageYOffset;
			projectsSection.style.backgroundPosition = `center ${scrollPosition * 0.3}px`;
		});
	}
}

function setupFactAnimations() {
	const factCards = document.querySelectorAll('.fact-card');
	const numberElements = document.querySelectorAll('.animate-number');
	if (factCards.length === 0) return;

	const animateNumber = element => {
		const target = Number.parseInt(element.dataset.target || '', 10);
		if (Number.isNaN(target)) return;

		const suffix = element.dataset.suffix || '';
		let current = 0;
		const duration = 2000;
		const steps = 60;
		const increment = target / steps;
		const stepTime = duration / steps;

		const timer = window.setInterval(() => {
			current += increment;
			if (current >= target) {
				window.clearInterval(timer);
				current = target;
			}
			element.textContent = `${Math.round(current)}${suffix}`;
		}, stepTime);
	};

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animationPlayState = 'running';
				const numberElement = entry.target.querySelector('.animate-number');
				if (numberElement) animateNumber(numberElement);
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

	factCards.forEach(card => {
		card.style.animationPlayState = 'paused';
		observer.observe(card);
	});

	numberElements.forEach(element => {
		const suffix = element.dataset.suffix || '';
		element.textContent = `0${suffix}`;
	});
}

function setupTimelineAnimations() {
	const timelineItems = document.querySelectorAll('.timeline-item');
	if (timelineItems.length === 0) return;

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animationPlayState = 'running';
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

	timelineItems.forEach(item => {
		item.style.animationPlayState = 'paused';
		observer.observe(item);
	});
}

function setupMobileMenu() {
	if (!burgerMenu || !mobileNav || !overlay) return;

	burgerMenu.addEventListener('click', event => {
		event.stopPropagation();
		if (isMenuOpen()) {
			closeMenu();
			return;
		}
		openMenu();
	});

	overlay.addEventListener('click', closeMenu);

	document.addEventListener('keydown', event => {
		if (event.key === 'Escape' && isMenuOpen()) {
			closeMenu();
		}
	});

	document.addEventListener('click', event => {
		if (!isMenuOpen()) return;
		if (mobileNav.contains(event.target) || burgerMenu.contains(event.target)) return;
		closeMenu();
	});
}

function setupCopyEmail() {
	const copyButton = document.querySelector('.copy-email-btn');
	const status = document.querySelector('.copy-status');
	if (!copyButton || !status) return;

	const legacyCopy = text => {
		const tempInput = document.createElement('input');
		tempInput.value = text;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy');
		document.body.removeChild(tempInput);
	};

	copyButton.addEventListener('click', async () => {
		const email = copyButton.dataset.email;
		if (!email) return;

		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(email);
			} else {
				legacyCopy(email);
			}
			status.textContent = 'Email copied.';
		} catch (error) {
			status.textContent = 'Could not copy email.';
		}

		window.setTimeout(() => {
			status.textContent = '';
		}, 2200);
	});
}

function setupCurrentYear() {
	const yearElement = document.querySelector('#current-year');
	if (!yearElement) return;
	yearElement.textContent = `${new Date().getFullYear()}`;
}

window.addEventListener('load', createParticles);
window.addEventListener('resize', () => {
	window.clearTimeout(particleResizeTimer);
	particleResizeTimer = window.setTimeout(createParticles, 180);
});

document.addEventListener('DOMContentLoaded', () => {
	setupSmoothScroll();
	setupProjectAnimations();
	setupFactAnimations();
	setupTimelineAnimations();
	setupMobileMenu();
	setupCopyEmail();
	setupCurrentYear();
});
