function initProductFilter() {
  console.log("Product.js filter init");

  const categoryItems = document.querySelectorAll('.category-item');
  if (categoryItems.length > 0) {
    categoryItems.forEach(item => {
      item.addEventListener('click', () => {
        const filterValue = item.getAttribute('data-filter');
        console.log("Clicked filter:", filterValue);
        const promoCards = document.querySelectorAll('.promo-card');
        promoCards.forEach(card => {
          if (card.classList.contains(filterValue)) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  const headers = document.querySelectorAll('.category-grid h2, section h2');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      document.querySelectorAll('.promo-card').forEach(card => {
        card.removeAttribute('hidden');
      });
    });
  });
}
