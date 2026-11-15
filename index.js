/* Experience is computed from the career start so it never goes stale. */
(() => {
  const CAREER_START = new Date(2018, 6, 1); // July 2018 (months are 0-indexed)
  const now = new Date();
  const totalMonths = Math.max(0,
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth()));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  const values = {
    years: String(years),                                   // "8"
    short: `${years}${months > 0 ? '+' : ''}`,              // "8+"
    full: plural(years, 'year') + (months > 0 ? ` ${plural(months, 'month')}` : '') // "8 years 4 months"
  };

  document.querySelectorAll('[data-exp]').forEach(el => {
    const value = values[el.getAttribute('data-exp')];
    if (value) el.textContent = value;
  });

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = metaDesc.content.replace(/\d+\+ years/, `${values.short} years`);
})();

document.getElementById('toggle').addEventListener('click', function () {
  var root = document.documentElement;
  var cur = root.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  var next = cur === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});
// nav border on scroll
var nav = document.getElementById('nav');
addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 8); }, { passive: true });
// reveal on scroll
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
// copy email
document.getElementById('copy').addEventListener('click', function () {
  var b = this;
  navigator.clipboard.writeText('rajan.chavda1@gmail.com').then(function () {
    b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Copy'; }, 1600);
  });
});
