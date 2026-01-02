export function numberToReal(
  value: string | number,
  currency: string = "BRL",
  locale: string = "pt-BR"
) {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : parseFloat(value.toString());
  if (isNaN(num)) return "";
  return num.toLocaleString(locale, { style: "currency", currency });
}