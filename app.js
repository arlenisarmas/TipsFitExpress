/*
  LINKS DE PAGO
  Aqui se colocan los links reales de pago.
  Por ahora son ejemplos.
  Cuando creemos Mercado Pago, PayPal, Stripe o Lemon Squeezy, reemplazamos
  cada URL por el link real.
*/
const paymentLinks = {
  mercadopago: "https://tu-link-mercadopago.com",
  paypal: "https://tu-link-paypal.com",
  stripe: "https://tu-link-stripe.com",
  lemonsqueezy: "https://tu-link-lemonsqueezy.com",
};

/*
  LISTA DE PAISES
  Estos nombres aparecen en el selector manual de pais.
  Si quieres agregar otro pais, debes agregarlo aqui y tambien en el HTML.
*/
const countryNames = {
  AR: "Argentina",
  BO: "Bolivia",
  BR: "Brasil",
  CL: "Chile",
  CO: "Colombia",
  CR: "Costa Rica",
  DO: "Republica Dominicana",
  EC: "Ecuador",
  SV: "El Salvador",
  ES: "Espana",
  GT: "Guatemala",
  HN: "Honduras",
  MX: "Mexico",
  NI: "Nicaragua",
  PA: "Panama",
  PE: "Peru",
  PR: "Puerto Rico",
  PT: "Portugal",
  PY: "Paraguay",
  UY: "Uruguay",
  US: "Estados Unidos",
  VE: "Venezuela",
  OTHER: "Otro pais",
};

/*
  DISPONIBILIDAD DE METODOS DE PAGO
  Aqui definimos que metodo de pago aparece en cada pais.
  Ejemplo:
  - Mercado Pago aparece en varios paises de Latinoamerica.
  - PayPal aparece como opcion global.
  - Stripe aparece solo donde este habilitado.
  - Lemon Squeezy sirve para ventas digitales internacionales.
*/
const availability = {
  mercadopago: ["AR", "BR", "MX", "CL", "CO", "PE", "UY", "EC"],
  paypal: ["AR", "BO", "BR", "CL", "CO", "CR", "DO", "EC", "SV", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PT", "PY", "UY", "US", "VE", "OTHER"],
  stripe: ["BR", "ES", "MX", "PT", "US"],
  lemonsqueezy: ["AR", "BO", "BR", "CL", "CO", "CR", "DO", "EC", "SV", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PT", "PY", "UY", "US", "VE", "OTHER"],
};

/*
  REGLA DE IDIOMA ESPANOL
  Estos paises cargan la landing en espanol por defecto.
  Si el visitante viene de Brasil o Portugal, usamos portugues.
  Si viene de otro pais, usamos ingles.
*/
const spanishCountries = new Set(["AR", "BO", "CL", "CO", "CR", "DO", "EC", "SV", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PY", "UY", "US", "VE"]);

/*
  TRADUCCIONES DE LA LANDING
  Este es uno de los bloques mas importantes.
  Todo elemento del HTML que tenga data-i18n toma su texto desde aqui.
  Si quieres cambiar el copy de venta, cambia los textos dentro de es, en o pt.
*/
const translations = {
  es: {
    navOffer: "Ver oferta",
    eyebrow: "Oferta digital con acceso inmediato",
    heroTitle: "Deja de improvisar tus comidas",
    heroSubtitle: "Recibe un menu mensual fit + 3 bonos para organizarte desde hoy, comprar mejor y saber que preparar sin pensar todo desde cero.",
    today: "Hoy",
    oldPrice: "Antes $29.99",
    save: "Ahorras 67%",
    mainCta: "Quiero mi menu ahora",
    trust1: "Acceso inmediato",
    trust2: "Pago seguro",
    trust3: "PDF mobile",
    painKicker: "Para mujeres ocupadas",
    painTitle: "Si cada lunes vuelves a empezar...",
    painText: "No necesitas mas fuerza de voluntad. Necesitas un plan claro que te diga que comer, que comprar y como ordenar tu semana desde el celular.",
    bundleKicker: "Bundle completo",
    bundleTitle: "Lo que recibes",
    productTitle: "Menu Mensual Fit",
    productText: "Ideas de comidas organizadas para dejar de improvisar durante el mes.",
    bonus1Title: "Lista de compras",
    bonus1Text: "Compra con direccion y evita llenar el carrito con cosas que no necesitas.",
    bonus2Title: "Tabla de calorias",
    bonus2Text: "Referencia simple por alimento para tomar mejores decisiones sin complicarte.",
    bonus3Title: "Postres Fit + Recetas Fit",
    bonus3Text: "Opciones dulces y comidas faciles para sostener el plan con gusto.",
    previewKicker: "Vista previa",
    previewTitle: "Abrelo desde el telefono y empieza hoy",
    previewCard1Label: "Semana 1",
    previewCard1: "Desayuno, almuerzo, cena",
    previewCard2Label: "Compras",
    previewCard2: "Lista ordenada por categoria",
    previewCard3Label: "Bonus",
    previewCard3: "Postres fit para antojos",
    downloads: "descargas estimadas",
    rating: "satisfaccion objetivo",
    testimonial1: "\"Me ayudo a dejar de pensar todos los dias que cocinar.\"",
    testimonial2: "\"Lo use desde el celular mientras hacia las compras.\"",
    client: "Cliente TipFit",
    offerKicker: "Oferta de lanzamiento",
    offerTitle: "Menu Mensual Fit + 3 bonos",
    offerItem1: "Menu mensual en PDF mobile",
    offerItem2: "Lista de compras",
    offerItem3: "Tabla de calorias por alimento",
    offerItem4: "Postres Fit + Recetas Fit",
    offerItem5: "Acceso inmediato despues del pago",
    finalPrice: "Precio final hoy",
    guarantee: "Garantia 7 dias",
    buyPrice: "Comprar por $9.99",
    paymentKicker: "Checkout inteligente",
    paymentTitle: "Elige como quieres pagar",
    paymentText: "Detectamos tu pais para mostrar metodos disponibles. Si usas VPN o la ubicacion falla, puedes cambiar el pais manualmente.",
    detected: "Pais detectado",
    changeCountry: "Cambiar pais",
    mpText: "Ideal si estas en paises de Latinoamerica donde Mercado Pago opera.",
    paypalText: "Opcion internacional para clientes que prefieren pagar con PayPal.",
    stripeText: "Tarjetas y wallets en paises habilitados para checkout internacional.",
    lemonText: "Muy util para productos digitales, impuestos y ventas internacionales.",
    faqKicker: "Preguntas frecuentes",
    faqTitle: "Antes de comprar",
    faq1Q: "Como recibo el menu?",
    faq1A: "Despues del pago recibes el acceso al PDF y los bonos en la pagina de gracias o por email.",
    faq2Q: "Necesito experiencia cocinando?",
    faq2A: "No. La idea es que sea simple, practico y facil de seguir desde tu telefono.",
    faq3Q: "Sirve si tengo poco tiempo?",
    faq3A: "Si. La landing esta pensada para vender una solucion de organizacion rapida, no una dieta complicada.",
    stickyProduct: "Menu + 3 bonos",
    stickyBuy: "Comprar",
  },
  en: {
    navOffer: "See offer",
    eyebrow: "Instant-access digital offer",
    heroTitle: "Stop improvising your meals",
    heroSubtitle: "Get a fit monthly menu + 3 bonuses to organize your meals today, shop smarter, and know what to cook without starting from zero.",
    today: "Today",
    oldPrice: "Was $29.99",
    save: "Save 67%",
    mainCta: "Get my menu now",
    trust1: "Instant access",
    trust2: "Secure payment",
    trust3: "Mobile PDF",
    painKicker: "For busy women",
    painTitle: "If every Monday feels like starting over...",
    painText: "You do not need more willpower. You need a clear plan that tells you what to eat, what to buy, and how to organize your week from your phone.",
    bundleKicker: "Complete bundle",
    bundleTitle: "What you get",
    productTitle: "Fit Monthly Menu",
    productText: "Organized meal ideas so you can stop improvising throughout the month.",
    bonus1Title: "Shopping list",
    bonus1Text: "Shop with direction and avoid filling your cart with things you do not need.",
    bonus2Title: "Calorie table",
    bonus2Text: "A simple food reference to make better choices without overthinking.",
    bonus3Title: "Fit Desserts + Fit Recipes",
    bonus3Text: "Sweet options and easy meals to help you stay consistent with more enjoyment.",
    previewKicker: "Preview",
    previewTitle: "Open it on your phone and start today",
    previewCard1Label: "Week 1",
    previewCard1: "Breakfast, lunch, dinner",
    previewCard2Label: "Shopping",
    previewCard2: "List organized by category",
    previewCard3Label: "Bonus",
    previewCard3: "Fit desserts for cravings",
    downloads: "estimated downloads",
    rating: "target satisfaction",
    testimonial1: "\"It helped me stop wondering what to cook every day.\"",
    testimonial2: "\"I used it from my phone while grocery shopping.\"",
    client: "TipFit customer",
    offerKicker: "Launch offer",
    offerTitle: "Fit Monthly Menu + 3 bonuses",
    offerItem1: "Monthly menu in mobile PDF",
    offerItem2: "Shopping list",
    offerItem3: "Food calorie table",
    offerItem4: "Fit Desserts + Fit Recipes",
    offerItem5: "Instant access after payment",
    finalPrice: "Final price today",
    guarantee: "7-day guarantee",
    buyPrice: "Buy for $9.99",
    paymentKicker: "Smart checkout",
    paymentTitle: "Choose how you want to pay",
    paymentText: "We detect your country to show available payment methods. If you use a VPN or location fails, you can change the country manually.",
    detected: "Detected country",
    changeCountry: "Change country",
    mpText: "Ideal if you are in Latin American countries where Mercado Pago operates.",
    paypalText: "International option for customers who prefer PayPal.",
    stripeText: "Cards and wallets in countries enabled for international checkout.",
    lemonText: "Very useful for digital products, taxes, and international sales.",
    faqKicker: "FAQ",
    faqTitle: "Before buying",
    faq1Q: "How do I receive the menu?",
    faq1A: "After payment you receive access to the PDF and bonuses on the thank-you page or by email.",
    faq2Q: "Do I need cooking experience?",
    faq2A: "No. The idea is simple, practical, and easy to follow from your phone.",
    faq3Q: "Does it work if I have little time?",
    faq3A: "Yes. This landing sells a fast organization solution, not a complicated diet.",
    stickyProduct: "Menu + 3 bonuses",
    stickyBuy: "Buy",
  },
  pt: {
    navOffer: "Ver oferta",
    eyebrow: "Oferta digital com acesso imediato",
    heroTitle: "Pare de improvisar suas refeicoes",
    heroSubtitle: "Receba um menu mensal fit + 3 bonus para se organizar hoje, comprar melhor e saber o que preparar sem comecar do zero.",
    today: "Hoje",
    oldPrice: "Antes $29.99",
    save: "Economize 67%",
    mainCta: "Quero meu menu agora",
    trust1: "Acesso imediato",
    trust2: "Pagamento seguro",
    trust3: "PDF mobile",
    painKicker: "Para mulheres ocupadas",
    painTitle: "Se toda segunda voce recomeca...",
    painText: "Voce nao precisa de mais forca de vontade. Precisa de um plano claro que diga o que comer, o que comprar e como organizar sua semana pelo celular.",
    bundleKicker: "Bundle completo",
    bundleTitle: "O que voce recebe",
    productTitle: "Menu Mensal Fit",
    productText: "Ideias de refeicoes organizadas para parar de improvisar durante o mes.",
    bonus1Title: "Lista de compras",
    bonus1Text: "Compre com direcao e evite encher o carrinho com coisas que nao precisa.",
    bonus2Title: "Tabela de calorias",
    bonus2Text: "Referencia simples por alimento para tomar melhores decisoes sem complicacao.",
    bonus3Title: "Sobremesas Fit + Receitas Fit",
    bonus3Text: "Opcoes doces e refeicoes faceis para manter o plano com prazer.",
    previewKicker: "Previa",
    previewTitle: "Abra no celular e comece hoje",
    previewCard1Label: "Semana 1",
    previewCard1: "Cafe, almoco, jantar",
    previewCard2Label: "Compras",
    previewCard2: "Lista organizada por categoria",
    previewCard3Label: "Bonus",
    previewCard3: "Sobremesas fit para desejos",
    downloads: "downloads estimados",
    rating: "satisfacao alvo",
    testimonial1: "\"Me ajudou a parar de pensar todos os dias no que cozinhar.\"",
    testimonial2: "\"Usei pelo celular enquanto fazia compras.\"",
    client: "Cliente TipFit",
    offerKicker: "Oferta de lancamento",
    offerTitle: "Menu Mensal Fit + 3 bonus",
    offerItem1: "Menu mensal em PDF mobile",
    offerItem2: "Lista de compras",
    offerItem3: "Tabela de calorias por alimento",
    offerItem4: "Sobremesas Fit + Receitas Fit",
    offerItem5: "Acesso imediato depois do pagamento",
    finalPrice: "Preco final hoje",
    guarantee: "Garantia de 7 dias",
    buyPrice: "Comprar por $9.99",
    paymentKicker: "Checkout inteligente",
    paymentTitle: "Escolha como quer pagar",
    paymentText: "Detectamos seu pais para mostrar os metodos disponiveis. Se usar VPN ou a localizacao falhar, voce pode trocar o pais manualmente.",
    detected: "Pais detectado",
    changeCountry: "Trocar pais",
    mpText: "Ideal se voce esta em paises da America Latina onde Mercado Pago opera.",
    paypalText: "Opcao internacional para clientes que preferem PayPal.",
    stripeText: "Cartoes e wallets em paises habilitados para checkout internacional.",
    lemonText: "Muito util para produtos digitais, impostos e vendas internacionais.",
    faqKicker: "Perguntas frequentes",
    faqTitle: "Antes de comprar",
    faq1Q: "Como recebo o menu?",
    faq1A: "Depois do pagamento voce recebe acesso ao PDF e aos bonus na pagina de obrigado ou por email.",
    faq2Q: "Preciso saber cozinhar?",
    faq2A: "Nao. A ideia e ser simples, pratico e facil de seguir pelo celular.",
    faq3Q: "Serve se eu tenho pouco tempo?",
    faq3A: "Sim. A landing vende uma solucao rapida de organizacao, nao uma dieta complicada.",
    stickyProduct: "Menu + 3 bonus",
    stickyBuy: "Comprar",
  },
};

/*
  ELEMENTOS DEL HTML QUE USA JAVASCRIPT
  Guardamos aqui los elementos que necesitamos controlar:
  selector de idioma, selector de pais, nombre del pais y tarjetas de pago.
*/
const languageSelect = document.querySelector("#languageSelect");
const countrySelect = document.querySelector("#countrySelect");
const countryLabel = document.querySelector("#countryLabel");
const paymentCards = document.querySelectorAll(".payment-card");

/*
  ANALITICA / EVENTOS DE PUBLICIDAD
  Esta funcion envia eventos si Meta Pixel o TikTok Pixel estan instalados.
  Sirve para que Meta y TikTok sepan cuando alguien inicia checkout.
*/
function trackEvent(name) {
  if (window.fbq) {
    window.fbq("track", name);
  }

  if (window.ttq) {
    window.ttq.track(name);
  }
}

/*
  FUNCIONES DE IDIOMA
  Estas funciones deciden que idioma mostrar y luego cambian los textos del HTML.
*/
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

/*
  FUNCIONES DEL CHECKOUT
  Estas funciones:
  - Aplican el pais seleccionado.
  - Muestran u ocultan metodos de pago.
  - Conectan los botones con los links de pago.
*/
function applyCountry(countryCode) {
  const normalizedCountry = countryNames[countryCode] ? countryCode : "OTHER";
  countrySelect.value = normalizedCountry;
  countryLabel.textContent = countryNames[normalizedCountry];

  paymentCards.forEach((card) => {
    const provider = card.dataset.provider;
    const isAvailable = availability[provider].includes(normalizedCountry);
    card.hidden = !isAvailable;
  });
}

function connectBuyButtons() {
  document.querySelectorAll(".js-buy").forEach((button) => {
    const provider = button.closest(".payment-card")?.dataset.provider;
    const paymentLink = provider ? paymentLinks[provider] : button.dataset.paymentLink;

    if (paymentLink) {
      button.dataset.paymentLink = paymentLink;
    }

    button.addEventListener("click", (event) => {
      const link = button.dataset.paymentLink;

      trackEvent("InitiateCheckout");

      if (!link || link.includes("tu-link")) {
        event.preventDefault();
        alert("Aqui conectaremos el link real de pago para este metodo.");
        return;
      }

      button.setAttribute("href", link);
    });
  });
}

/*
  DETECCION DE PAIS
  Intenta detectar el pais usando IP.
  Si falla, usa el idioma del navegador como plan B.
  Esto ayuda a mostrar idioma y metodos de pago correctos automaticamente.
*/
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

/*
  EVENTOS DEL USUARIO
  Aqui escuchamos cuando una persona cambia idioma o cambia pais manualmente.
*/
languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

countrySelect.addEventListener("change", (event) => {
  const countryCode = event.target.value;
  applyCountry(countryCode);
  applyLanguage(getLanguageForCountry(countryCode));
});

/*
  INICIALIZACION
  Esto se ejecuta cuando carga la pagina:
  - Conecta botones de compra.
  - Detecta pais.
  - Aplica idioma y metodos de pago.
*/
connectBuyButtons();

detectCountry().then((countryCode) => {
  applyCountry(countryCode);
  applyLanguage(getLanguageForCountry(countryCode));
});
