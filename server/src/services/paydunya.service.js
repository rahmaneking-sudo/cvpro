import paydunya from 'paydunya';

// Configure PayDunya
const getCleanKey = (key) => key ? key.trim() : undefined;
const privateKey = getCleanKey(process.env.PAYDUNYA_PRIVATE_KEY);
const autoMode = privateKey && privateKey.includes('live_') ? 'live' : 'test';

const setup = new paydunya.Setup({
  masterKey: getCleanKey(process.env.PAYDUNYA_MASTER_KEY),
  privateKey: privateKey,
  publicKey: getCleanKey(process.env.PAYDUNYA_PUBLIC_KEY),
  token: getCleanKey(process.env.PAYDUNYA_TOKEN),
  mode: process.env.PAYDUNYA_MODE || autoMode // Automatique basé sur la clé
});

// Pour PayDunya, on utilise TOUJOURS le domaine de production (pas CLIENT_URL qui peut être localhost)
const PAYDUNYA_SITE_URL = 'https://samacvpro.com';

// Configure Store - Les noms de propriétés doivent correspondre EXACTEMENT au SDK paydunya
const store = new paydunya.Store({
  name: "Samacvpro",
  tagline: "L'excellence pour votre CV",
  phoneNumber: "777185723",
  postalAddress: "Dakar, Sénégal",
  logoURL: `${PAYDUNYA_SITE_URL}/logo.png`,
  websiteURL: PAYDUNYA_SITE_URL,
  returnURL: `${PAYDUNYA_SITE_URL}/dashboard?payment=success`,
  cancelURL: `${PAYDUNYA_SITE_URL}/dashboard?payment=cancel`,
  callbackURL: `${PAYDUNYA_SITE_URL}/api/payments/webhook`
});

/**
 * Créer une facture pour paiement (Redirection vers page sécurisée PayDunya)
 */
export const createInvoice = async (amount, description, cancelUrl, returnUrl) => {
  return new Promise((resolve, reject) => {
    const invoice = new paydunya.CheckoutInvoice(setup, store);
    invoice.addItem("Service CV Premium", 1, amount, amount, description);
    invoice.totalAmount = amount;
    
    // Configurer les URLs de redirection (override si fournies)
    invoice.addCustomData('description', description);
    if (returnUrl) invoice.returnURL = returnUrl;
    if (cancelUrl) invoice.cancelURL = cancelUrl;

    invoice.create().then(() => {
      resolve({
        url: invoice.url,
        token: invoice.token
      });
    }).catch(e => reject(e));
  });
};

/**
 * Paiement Mobile (Direct Pay / Softpay)
 * Note: L'ancienne librairie paydunya-node ne supporte pas nativement SoftPay.
 * Nous allons faire un appel API REST standard vers l'endpoint SoftPay.
 */
export const createDirectPay = async (amount, phone, walletProvider, accountAlias) => {
  // Le provider pour le Softpay (orange-money-senegal, wave-senegal, free-money-senegal)
  const walletMap = {
    'orange': 'orange-money-senegal',
    'wave': 'wave-senegal',
    'free': 'free-money-senegal'
  };

  const baseUrl = setup.mode === 'test' ? 'https://app.paydunya.com/sandbox-api/v1' : 'https://app.paydunya.com/api/v1';
  const url = `${baseUrl}/softpay/${walletMap[walletProvider]}`;

  const payload = {
    payment_token: "", // Sera mis à jour après la création de la facture
    phone_number: phone
  };

  try {
    // 1. D'abord on crée une facture classique pour récupérer le token
    const invoice = new paydunya.CheckoutInvoice(setup, store);
    invoice.addItem("Service CV Premium", 1, amount, amount, "Paiement Mobile");
    invoice.totalAmount = amount;
    
    await invoice.create();
    const token = invoice.token;
    payload.payment_token = token;

    // 2. Ensuite on déclenche le SoftPay (Paiement direct)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return {
      success: data.response_code === '00',
      message: data.response_text,
      token: token,
      data: data
    };
  } catch (error) {
    console.error('PayDunya API Error Data:', error);
    // error might be an object from PayDunya (e.g., { response_code: '...', response_text: '...' })
    const apiMsg = error.response_text ? error.response_text : (error.data && error.data.response_text ? error.data.response_text : '');
    const baseMsg = error.message ? error.message : 'Refusé par PayDunya';
    throw new Error(`Erreur lors du paiement mobile : ${baseMsg} ${apiMsg ? '(' + apiMsg + ')' : ''}`);
  }
};

/**
 * Vérifier le statut d'une facture PayDunya
 */
export const checkInvoiceStatus = async (token) => {
  const baseUrl = setup.mode === 'test' ? 'https://app.paydunya.com/sandbox-api/v1' : 'https://app.paydunya.com/api/v1';
  const url = `${baseUrl}/checkout-invoice/confirm/${token}`;
  
  const response = await fetch(url, {
    headers: {
      'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
      'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
      'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN
    }
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`PayDunya a renvoyé une réponse non-JSON (HTML/Erreur serveur) : ${text.substring(0, 100)}...`);
  }

  return await response.json();
};
