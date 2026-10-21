/* =========================================================
   Progressive enhancement only.
   - Works with JS disabled: nothing here is required to read.
   - No storage, no network, no tracking.
   - Language-agnostic: all user-visible strings come from
     data-* attributes in the HTML.
   ========================================================= */
(function () {
	"use strict";

	var root = document.documentElement;

	// Mark that JS is running so CSS can opt-in to reveal animations
	// and hide JS-only controls (theme toggle) when it isn't.
	root.classList.add("js");
	root.classList.remove("no-js");

	/* ---------- Theme toggle (no persistence) ---------- */
	// theme.js already set data-theme on load from ?theme=light.
	// Here we only toggle the attribute at runtime, update the visible
	// label text, and keep the language-switch URL in sync. Nothing is
	// stored anywhere. The aria-label is fixed per page; aria-pressed
	// carries the state so screen readers announce it exactly once.
	var themeToggle = document.querySelector(".theme-toggle");
	var langSwitch = document.querySelector(".lang-switch");

	function currentTheme() {
		return root.getAttribute("data-theme") === "light" ? "light" : "dark";
	}

	function applyTheme(theme) {
		if (theme === "light") {
			root.setAttribute("data-theme", "light");
		} else {
			root.removeAttribute("data-theme");
		}
		syncThemeUI();
	}

	function syncThemeUI() {
		var isLight = currentTheme() === "light";

		if (themeToggle) {
			themeToggle.setAttribute("aria-pressed", String(isLight));
			var text = isLight
				? themeToggle.dataset.lightText
				: themeToggle.dataset.darkText;
			if (text) themeToggle.textContent = text;
		}

		// Carry the theme across the language switch via ?theme=light only.
		if (langSwitch) {
			var href = langSwitch.getAttribute("href") || "";
			var base = href.split("?")[0];
			langSwitch.setAttribute("href", isLight ? base + "?theme=light" : base);
		}
	}

	if (themeToggle) {
		syncThemeUI();
		themeToggle.addEventListener("click", function () {
			applyTheme(currentTheme() === "light" ? "dark" : "light");
		});
	}

	/* ---------- Mobile nav ---------- */
	var toggle = document.querySelector(".nav-toggle");
	var nav = document.getElementById("primary-nav");

	function setNavOpen(open) {
		if (!toggle || !nav) return;
		toggle.setAttribute("aria-expanded", String(open));
		nav.classList.toggle("is-open", open);
		var label = open
			? toggle.dataset.closeLabel
			: toggle.dataset.openLabel;
		if (label) toggle.setAttribute("aria-label", label);
	}

	if (toggle && nav) {
		toggle.addEventListener("click", function () {
			setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
		});
		nav.addEventListener("click", function (e) {
			if (e.target.closest("a")) setNavOpen(false);
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
				setNavOpen(false);
				toggle.focus();
			}
		});
		document.addEventListener("click", function (e) {
			if (toggle.getAttribute("aria-expanded") !== "true") return;
			if (nav.contains(e.target) || toggle.contains(e.target)) return;
			setNavOpen(false);
		});
	}

	/* ---------- Copy email ---------- */
	var copyBtn = document.querySelector(".copy-btn");
	var status = document.querySelector(".copy-status");

	function legacyCopy(value) {
		var input = document.createElement("textarea");
		input.value = value;
		input.setAttribute("readonly", "");
		input.style.position = "fixed";
		input.style.opacity = "0";
		document.body.appendChild(input);
		input.select();
		var ok = false;
		try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
		document.body.removeChild(input);
		return ok;
	}

	if (copyBtn && status) {
		var text = copyBtn.dataset.copy || "";
		var okLabel = copyBtn.dataset.copiedLabel || "copied";
		var errLabel = copyBtn.dataset.errorLabel || "error";
		var timer = 0;

		copyBtn.addEventListener("click", function () {
			function done(ok) {
				status.textContent = ok ? okLabel : errLabel;
				clearTimeout(timer);
				timer = setTimeout(function () { status.textContent = ""; }, 2400);
			}

			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(function () { done(true); },
					function () { done(legacyCopy(text)); });
			} else {
				done(legacyCopy(text));
			}
		});
	}

	/* ---------- Scroll reveal ---------- */
	var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (!reduce && "IntersectionObserver" in window) {
		var sections = document.querySelectorAll("main .section");
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					io.unobserve(entry.target);
				}
			});
		}, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

		root.classList.add("reveal-init");
		sections.forEach(function (s) { io.observe(s); });
	}

	/* ---------- Counter animation ---------- */
	if (!reduce && "IntersectionObserver" in window) {
		var counters = document.querySelectorAll(".counter[data-count-to]");
		var co = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var el = entry.target;
				co.unobserve(el);
				var target = parseInt(el.dataset.countTo, 10);
				var suffix = el.dataset.suffix || "";
				if (!isFinite(target)) return;
				var start = performance.now();
				var dur = 900;
				(function tick(now) {
					var p = Math.min(1, (now - start) / dur);
					var eased = 1 - Math.pow(1 - p, 3);
					el.textContent = String(Math.round(target * eased)) + suffix;
					if (p < 1) requestAnimationFrame(tick);
					else el.textContent = String(target) + suffix;
				})(start);
			});
		}, { threshold: 0.4 });
		counters.forEach(function (c) { co.observe(c); });
	}
})();
