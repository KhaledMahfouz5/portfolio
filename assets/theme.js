/* =========================================================
   Tiny synchronous theme reader.
   Loaded WITHOUT defer in <head> so ?theme=light is applied to
   <html> before the first paint — no dark flash. Deliberately
   kept inline-free to satisfy the strict CSP.
   Accepts only exact "light" or "dark"; anything else is ignored.
   Dark is the default, so "dark" simply leaves the attribute off.
   ========================================================= */
(function () {
	"use strict";
	var q = window.location.search;
	if (!q) return;
	var value = new URLSearchParams(q).get("theme");
	if (value === "light") {
		document.documentElement.setAttribute("data-theme", "light");
	} else if (value === "dark") {
		document.documentElement.removeAttribute("data-theme");
	}
})();
