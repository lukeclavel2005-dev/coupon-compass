
// Shared deals data for dynamic features
const deals = [
  {
    store: "Amazon",
    title: "15% Off Electronics",
    code: "SAVE15",
    category: "Technology",
    url: "https://www.amazon.com",
    description: "Save on select laptops, headphones, and accessories."
  },
  {
    store: "Target",
    title: "$10 Off $50 Purchase",
    code: "TAKE10",
    category: "Home",
    url: "https://www.target.com",
    description: "Great for home, essentials, and decor."
  },
  {
    store: "Best Buy",
    title: "Up to 20% Off Laptops",
    code: "LAPTOP20",
    category: "Technology",
    url: "https://www.bestbuy.com",
    description: "Discounts on select Windows and Mac laptops."
  },
  {
    store: "Walmart",
    title: "Grocery Rollbacks",
    code: "ROLLBACK",
    category: "Grocery",
    url: "https://www.walmart.com",
    description: "Lower prices on everyday grocery items."
  },
  {
    store: "Travel Deals",
    title: "Extra 12% Off Hotels",
    code: "TRAVEL12",
    category: "Travel",
    url: "https://www.expedia.com",
    description: "Stack savings on select hotel bookings."
  },
  {
    store: "Fashion Outlet",
    title: "Buy 1 Get 1 50% Off",
    code: "STYLE50",
    category: "Fashion",
    url: "https://www.macys.com",
    description: "Applies to clothing and accessories."
  }
];

// FEATURED DEALS ON HOME PAGE
function renderFeaturedDeals() {
  const container = document.getElementById("featured-deals");
  if (!container) return;

  container.innerHTML = "";

  // Choose first 3 deals as featured
  const featured = deals.slice(0, 3);
  featured.forEach((deal, index) => {
    const card = document.createElement("div");
    card.className = "card featured-card";
    card.innerHTML = `
      <h3>${deal.store}</h3>
      <p><strong>${deal.title}</strong></p>
      <p>Code: <strong>${deal.code}</strong></p>
      <p><a href="${deal.url}" target="_blank" rel="noopener noreferrer">Open Deal Website</a></p>
    `;
    container.appendChild(card);
  });

  // Simple rotation: highlight a different card every few seconds
  let current = 0;
  const cards = container.querySelectorAll(".featured-card");
  if (cards.length === 0) return;

  cards.forEach(c => c.classList.remove("active-featured"));
  cards[0].classList.add("active-featured");

  setInterval(() => {
    cards[current].classList.remove("active-featured");
    current = (current + 1) % cards.length;
    cards[current].classList.add("active-featured");
  }, 4000);
}

// CATEGORY FILTERING ON CATEGORIES PAGE
function setupCategoryFilters() {
  const categoryLinks = document.querySelectorAll("[data-category]");
  const results = document.getElementById("category-results");
  if (!results || categoryLinks.length === 0) return;

  function renderCategory(cat) {
    results.innerHTML = "";
    const matching = deals.filter(
      d => d.category.toLowerCase() === cat.toLowerCase()
    );
    if (matching.length === 0) {
      results.innerHTML = "<p>No deals found for this category yet.</p>";
      return;
    }
    matching.forEach(deal => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${deal.title}</h3>
        <p><strong>Store:</strong> ${deal.store}</p>
        <p><strong>Code:</strong> ${deal.code}</p>
        <p><a href="${deal.url}" target="_blank" rel="noopener noreferrer">View Deal Website</a></p>
      `;
      results.appendChild(card);
    });
  }

  categoryLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      const cat = this.getAttribute("data-category");
      if (!cat) return;
      e.preventDefault();
      renderCategory(cat);
    });
  });
}

// SEARCH PAGE FUNCTIONALITY
function searchDeals() {
  const input = document.getElementById("searchBox");
  const results = document.getElementById("results");
  if (!input || !results) return;

  const q = input.value.trim().toLowerCase();
  if (q === "") {
    results.innerHTML = "<p>Type a store, category, or keyword to see matching deals.</p>";
    return;
  }

  const matches = deals.filter(d =>
    d.store.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q) ||
    d.title.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    results.innerHTML = "<p>No results found. Try another word.</p>";
    return;
  }

  results.innerHTML = "";
  matches.forEach(deal => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${deal.title}</h3>
      <p><strong>Store:</strong> ${deal.store}</p>
      <p><strong>Category:</strong> ${deal.category}</p>
      <p><strong>Code:</strong> ${deal.code}</p>
      <p><a href="${deal.url}" target="_blank" rel="noopener noreferrer">Open Deal Website</a></p>
    `;
    results.appendChild(card);
  });
}

// Attach behaviors on page load
document.addEventListener("DOMContentLoaded", function () {
  renderFeaturedDeals();
  setupCategoryFilters();

  // Initialize search results text if on search page
  const results = document.getElementById("results");
  if (results) {
    results.innerHTML = "<p>Type a store, category, or keyword to see matching deals.</p>";
  }
});
