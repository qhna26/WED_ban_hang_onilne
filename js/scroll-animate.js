const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    } else {
      entry.target.classList.remove('in-view');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -10% 0px"
});

document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
