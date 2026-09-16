// Coupon Compass demo data.
// This will be replaced with API/database data in a later build stage.
const deals = [
  {
    store: "Amazon",
    title: "15% Off Electronics",
    code: "SAVE15",
    category: "Technology",
    url: "https://www.amazon.com",
    description: "Save on select laptops, headphones, and accessories.",
    badge: "15% off"
  },
  {
    store: "Target",
    title: "$10 Off $50 Purchase",
    code: "TAKE10",
    category: "Home",
    url: "https://www.target.com",
    description: "A sample offer for home essentials and decor.",
    badge: "$10 off"
  },
  {
    store: "Best Buy",
    title: "Up to 20% Off Laptops",
    code: "LAPTOP20",
    category: "Technology",
    url: "https://www.bestbuy.com",
    description: "A demo laptop deal used to test Coupon Compass search.",
    badge: "20% off"
  },
  {
    store: "Walmart",
    title: "Grocery Rollbacks",
    code: "ROLLBACK",
    category: "Grocery",
    url: "https://www.walmart.com",
    description: "Sample savings on everyday grocery items.",
    badge: "Demo"
  },
  {
    store: "Travel Deals",
    title: "Extra 12% Off Hotels",
    code: "TRAVEL12",
    category: "Travel",
    url: "https://www.expedia.com",
    description: "A sample hotel offer for testing travel search.",
    badge: "12% off"
  },
  {
    store: "Fashion Outlet",
    title: "Buy 1 Get 1 50% Off",
    code: "STYLE50",
    category: "Fashion",
    url: "https://www.macys.com",
    description: "A demo clothing and accessories promotion.",
    badge: "BOGO"
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dealCardMarkup(deal) {
  return `
    <article class="deal-card">
      <div class="deal-topline">
        <span class="store-pill">${escapeHtml(deal.store)}</span>
        <span class="deal-badge">${escapeHtml(deal.badge || deal.category)}</span>
      </div>
      <h3>${escapeHtml(deal.title)}</h3>
      <p class="deal-description">${escapeHtml(deal.description)}</p>
      <div class="deal-actions">
        <button class="code-button" type="button" data-copy-code="${escapeHtml(deal.code)}" aria-label="Copy coupon code ${escapeHtml(deal.code)}">
          Code: ${escapeHtml(deal.code)}
        </button>
        <a class="deal-link" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener noreferrer">Visit</a>
      </div>
    </article>
  `;
}

function renderFeaturedDeals() {
  const container = document.getElementById("featured-deals");
  if (!container) return;

  container.innerHTML = deals.slice(0, 3).map(dealCardMarkup).join("");
}

function renderContextDeals() {
  const container = document.getElementById("page-deals");
  if (!container) return;

  const store = (container.dataset.store || "").trim().toLowerCase();
  const category = (container.dataset.category || "").trim().toLowerCase();

  const matches = deals.filter(deal => {
    const storeMatch = !store || deal.store.toLowerCase() === store;
    const categoryMatch = !category || deal.category.toLowerCase() === category;
    return storeMatch && categoryMatch;
  });

  if (matches.length === 0) {
    const label = container.dataset.store || container.dataset.category || "this page";
    container.innerHTML = `
      <article class="deal-card">
        <div class="deal-topline">
          <span class="store-pill">${escapeHtml(label)}</span>
          <span class="deal-badge">Coming next</span>
        </div>
        <h3>No demo offers here yet.</h3>
        <p class="deal-description">This page is ready for live deal data. For now, try the full Coupon Compass demo search.</p>
        <div class="deal-actions">
          <a class="deal-link" href="search.html">Search all deals</a>
        </div>
      </article>
    `;
    return;
  }

  container.innerHTML = matches.map(dealCardMarkup).join("");
}

function showCopyStatus(code) {
  document.querySelector(".copy-status")?.remove();
  const status = document.createElement("div");
  status.className = "copy-status";
  status.textContent = `Copied ${code}`;
  status.setAttribute("role", "status");
  document.body.appendChild(status);
  setTimeout(() => status.remove(), 1800);
}

async function copyCouponCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    showCopyStatus(code);
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showCopyStatus(code);
  }
}

function setupCopyButtons() {
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-copy-code]");
    if (!button) return;
    copyCouponCode(button.dataset.copyCode);
  });
}

function setupCategoryFilters() {
  const categoryLinks = document.querySelectorAll("[data-category]");
  const results = document.getElementById("category-results");
  if (!results || categoryLinks.length === 0) return;

  function renderCategory(category) {
    const matching = deals.filter(
      deal => deal.category.toLowerCase() === category.toLowerCase()
    );

    if (matching.length === 0) {
      results.innerHTML = "<p>No demo deals found for this category yet.</p>";
      return;
    }

    results.innerHTML = matching.map(dealCardMarkup).join("");
  }

  categoryLinks.forEach(link => {
    link.addEventListener("click", event => {
      const category = link.getAttribute("data-category");
      if (!category) return;
      event.preventDefault();
      renderCategory(category);
    });
  });
}

function getSearchMatches(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return deals.filter(deal =>
    [deal.store, deal.category, deal.title, deal.description, deal.code]
      .some(value => value.toLowerCase().includes(q))
  );
}

function renderSearchResults(query) {
  const results = document.getElementById("results");
  if (!results) return;

  const q = query.trim();
  if (!q) {
    results.innerHTML = "<p>Type a store, category, product, or keyword to see matching demo deals.</p>";
    return;
  }

  const matches = getSearchMatches(q);
  if (matches.length === 0) {
    results.innerHTML = `<p>No demo deals found for <strong>${escapeHtml(q)}</strong>. Try another search.</p>`;
    return;
  }

  results.innerHTML = `<p class="small-note">${matches.length} demo result${matches.length === 1 ? "" : "s"} for “${escapeHtml(q)}”</p>` +
    matches.map(dealCardMarkup).join("");
}

function searchDeals() {
  const input = document.getElementById("searchBox");
  if (!input) return;
  renderSearchResults(input.value);
}

function initializeSearchPage() {
  const input = document.getElementById("searchBox");
  if (!input) return;

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";

  if (query) {
    input.value = query;
    renderSearchResults(query);
  } else {
    renderSearchResults("");
  }

  input.addEventListener("input", searchDeals);
}

function setupHeroSearch() {
  const form = document.getElementById("heroSearchForm");
  const input = document.getElementById("heroSearch");
  if (!form || !input) return;

  form.addEventListener("submit", event => {
    if (!input.value.trim()) {
      event.preventDefault();
      input.focus();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedDeals();
  renderContextDeals();
  setupCopyButtons();
  setupCategoryFilters();
  initializeSearchPage();
  setupHeroSearch();
});
