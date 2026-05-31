const {
  countries,
  countryNames,
  paymentAvailability,
  paymentLinks,
  spanishCountries,
} = window.TipFitConfig;
const { translations } = window.TipFitI18n;

const languageSelect = document.querySelector("#languageSelect");
const countrySelect = document.querySelector("#countrySelect");
const countryLabel = document.querySelector("#countryLabel");
const paymentCards = document.querySelectorAll(".payment-card");

function trackEvent(name) {
  window.fbq?.("track", name);
  window.ttq?.track(name);
}

function getLanguageForCountry(countryCode) {
  if (countryCode === "BR" || countryCode === "PT") {
    return "pt";
  }

  if (spanishCountries.has(countryCode)) {
    return "es";
  }

  return "en";
}

function applyLanguage(language) {
  const copy = translations[language] || translations.es;
  document.documentElement.lang = language;
  languageSelect.value = language;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;

    if (copy[key]) {
      node.textContent = copy[key];
    }
  });
}

function renderCountryOptions() {
  countrySelect.innerHTML = countries
    .map(([code, label]) => `<option value="${code}">${label}</option>`)
    .join("");
}

function applyCountry(countryCode) {
  const normalizedCountry = countryNames[countryCode] ? countryCode : "OTHER";
  countrySelect.value = normalizedCountry;
  countryLabel.textContent = countryNames[normalizedCountry];

  paymentCards.forEach((card) => {
    const provider = card.dataset.provider;
    const availableCountries = paymentAvailability[provider] || [];
    card.hidden = !availableCountries.includes(normalizedCountry);
  });
}

function connectBuyButtons() {
  document.querySelectorAll(".js-buy").forEach((button) => {
    const provider = button.closest(".payment-card")?.dataset.provider;
    const paymentLink = provider ? paymentLinks[provider] : "";

    button.setAttribute("href", paymentLink || "#");

    button.addEventListener("click", (event) => {
      trackEvent("InitiateCheckout");

      if (!paymentLink || paymentLink.includes("tu-link")) {
        event.preventDefault();
        alert("Aqui conectaremos el link real de pago para este metodo.");
      }
    });
  });
}

async function detectCountry() {
  try {
    const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Geo lookup failed");
    }

    const data = await response.json();
    return data.country_code || "OTHER";
  } catch (error) {
    const browserLanguage = navigator.language || "es";

    if (browserLanguage.toLowerCase().startsWith("pt")) {
      return "BR";
    }

    if (browserLanguage.toLowerCase().startsWith("es")) {
      return "AR";
    }

    return "US";
  }
}

languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

countrySelect.addEventListener("change", (event) => {
  const countryCode = event.target.value;
  applyCountry(countryCode);
  applyLanguage(getLanguageForCountry(countryCode));
});

renderCountryOptions();
connectBuyButtons();

detectCountry().then((countryCode) => {
  applyCountry(countryCode);
  applyLanguage(getLanguageForCountry(countryCode));
});
