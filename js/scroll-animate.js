document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll(".scroll-animate");

  function elementInView(el, offset = 100) {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight - offset);
  }

  function displayScrollElement(el) {
    el.classList.add("in-view");
  }

  function hideScrollElement(el) {
    el.classList.remove("in-view");
  }

  function handleScrollAnimation() {
    scrollElements.forEach((el) => {
      if (elementInView(el)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  }

  window.addEventListener("scroll", handleScrollAnimation);
  handleScrollAnimation();
});
