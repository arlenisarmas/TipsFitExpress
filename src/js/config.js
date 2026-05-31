const paymentLinks = {
  mercadopago: "https://tu-link-mercadopago.com",
  paypal: "https://tu-link-paypal.com",
  stripe: "https://tu-link-stripe.com",
  lemonsqueezy: "https://tu-link-lemonsqueezy.com",
};

const countries = [
  ["AR", "Argentina"],
  ["BO", "Bolivia"],
  ["BR", "Brasil"],
  ["CL", "Chile"],
  ["CO", "Colombia"],
  ["CR", "Costa Rica"],
  ["DO", "Republica Dominicana"],
  ["EC", "Ecuador"],
  ["SV", "El Salvador"],
  ["ES", "Espana"],
  ["GT", "Guatemala"],
  ["HN", "Honduras"],
  ["MX", "Mexico"],
  ["NI", "Nicaragua"],
  ["PA", "Panama"],
  ["PE", "Peru"],
  ["PR", "Puerto Rico"],
  ["PT", "Portugal"],
  ["PY", "Paraguay"],
  ["UY", "Uruguay"],
  ["US", "Estados Unidos"],
  ["VE", "Venezuela"],
  ["OTHER", "Otro pais"],
];

const countryNames = Object.fromEntries(countries);

const paymentAvailability = {
  mercadopago: ["AR", "BR", "MX", "CL", "CO", "PE", "UY", "EC"],
  paypal: ["AR", "BO", "BR", "CL", "CO", "CR", "DO", "EC", "SV", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PT", "PY", "UY", "US", "VE", "OTHER"],
  stripe: ["BR", "ES", "MX", "PT", "US"],
  lemonsqueezy: ["AR", "BO", "BR", "CL", "CO", "CR", "DO", "EC", "SV", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PT", "PY", "UY", "US", "VE", "OTHER"],
};

const spanishCountries = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "DO",
  "EC",
  "SV",
  "ES",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "UY",
  "US",
  "VE",
]);

window.TipFitConfig = {
  countries,
  countryNames,
  paymentAvailability,
  paymentLinks,
  spanishCountries,
};
