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
        <a class="deal-link" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${escapeHtml(deal.store)} website">Visit ${escapeHtml(deal.store)}</a>
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
    const copied = document.execCommand("copy");
    textArea.remove();
    if (copied) {
      showCopyStatus(code);
    } else {
      window.prompt("Copy this coupon code:", code);
    }
  }
}

function setupCopyButtons() {
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-copy-code]");
    if (!button) return;
    copyCouponCode(button.dataset.copyCode);
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

function searchDeals({ updateUrl = true } = {}) {
  const input = document.getElementById("searchBox");
  if (!input) return;
  renderSearchResults(input.value);

  if (updateUrl) {
    const url = new URL(window.location.href);
    const query = input.value.trim();
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url);
  }
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

  input.addEventListener("input", () => searchDeals());

  const form = document.getElementById("searchForm");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    searchDeals();
  });
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

function setupAssistantWidget() {
  const widget = document.createElement("aside");
  widget.className = "assistant-widget";
  widget.innerHTML = `
    <button
      class="assistant-launcher"
      type="button"
      aria-expanded="false"
      aria-controls="assistant-panel"
    >
      <span aria-hidden="true">✦</span>
      Ask Coupon Compass
    </button>

    <section class="assistant-panel" id="assistant-panel" aria-labelledby="assistant-title" hidden>
      <header class="assistant-header">
        <div>
          <span class="assistant-label">SHOPPING ASSISTANT</span>
          <h2 id="assistant-title">Ask Coupon Compass</h2>
        </div>
        <button class="assistant-close" type="button" aria-label="Close assistant">×</button>
      </header>

      <div class="assistant-messages" role="log" aria-live="polite" aria-relevant="additions">
        <div class="assistant-message assistant-message-bot">
          Hi! I’ll help you compare Coupon Compass deals. My AI connection is the next build stage.
        </div>
      </div>

      <form class="assistant-form">
        <label class="sr-only" for="assistant-input">Ask about a deal</label>
        <input id="assistant-input" type="text" placeholder="Ask about laptops, travel, stores…" autocomplete="off">
        <button type="submit">Send</button>
      </form>
    </section>
  `;
  document.body.appendChild(widget);

  const launcher = widget.querySelector(".assistant-launcher");
  const panel = widget.querySelector(".assistant-panel");
  const closeButton = widget.querySelector(".assistant-close");
  const form = widget.querySelector(".assistant-form");
  const input = widget.querySelector("#assistant-input");
  const messages = widget.querySelector(".assistant-messages");

  function setOpen(isOpen) {
    panel.hidden = !isOpen;
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      input.focus();
    } else {
      launcher.focus();
    }
  }

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    const userMessage = document.createElement("div");
    userMessage.className = "assistant-message assistant-message-user";
    userMessage.textContent = question;
    messages.appendChild(userMessage);

    const placeholderReply = document.createElement("div");
    placeholderReply.className = "assistant-message assistant-message-bot";
    placeholderReply.textContent = "The chat interface is working. We’ll connect it to the secure AI backend in Stage 2.";
    messages.appendChild(placeholderReply);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
    input.focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedDeals();
  renderContextDeals();
  setupCopyButtons();
  initializeSearchPage();
  setupHeroSearch();
  setupAssistantWidget();
});
