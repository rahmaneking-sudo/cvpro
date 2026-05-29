// client/src/utils/currency.js

// Récupère la devise de l'utilisateur basée sur son IP
export async function getUserCurrency() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    const currency = data.currency; // ex: 'EUR', 'USD', 'XOF'
    // Limiter aux devises supportées ou connues, fallback sur XOF si non reconnu
    return currency || 'XOF';
  } catch (e) {
    console.warn("Erreur détection devise IP, fallback XOF:", e);
    return 'XOF';
  }
}

// Convertit le montant XOF vers la devise cible en temps réel
export async function convertFromXOF(amountXOF, targetCurrency) {
  if (!targetCurrency || targetCurrency === 'XOF' || targetCurrency === 'XAF') {
    return { amount: amountXOF, currency: targetCurrency || 'XOF', symbol: 'FCFA' };
  }
  
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/XOF');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    const rate = data.rates[targetCurrency];
    
    if (!rate) {
      return { amount: amountXOF, currency: 'XOF', symbol: 'FCFA' };
    }

    const converted = (amountXOF * rate).toFixed(2);
    
    // Déterminer le symbole
    let symbol = targetCurrency;
    if (targetCurrency === 'EUR') symbol = '€';
    if (targetCurrency === 'USD') symbol = '$';
    if (targetCurrency === 'CAD') symbol = '$ CA';
    if (targetCurrency === 'GBP') symbol = '£';

    return { amount: converted, currency: targetCurrency, symbol, rate };
  } catch (e) {
    console.warn("Erreur conversion devise, fallback XOF:", e);
    return { amount: amountXOF, currency: 'XOF', symbol: 'FCFA', rate: 1 };
  }
}

// Formate un prix brut en FCFA ("5 000" ou 5000) en Number
export function parseBasePrice(priceInput) {
  if (typeof priceInput === 'number') return priceInput;
  if (!priceInput) return 0;
  return Number(String(priceInput).replace(/[^\d]/g, ''));
}
