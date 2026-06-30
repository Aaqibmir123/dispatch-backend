// Invoice utility helpers for formatting, PDF generation, template rendering, and email payloads.

const formatCurrency = (value, currency = "USD") => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
};

module.exports = {
  formatCurrency,
};
