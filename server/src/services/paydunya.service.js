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

// Configure Store
const store = new paydunya.Store({
  name: "Samacvpro",
  tagline: "L'excellence pour votre CV",
  phoneNumber: "336530583", // A modifier selon le client
  postalAddress: "Dakar, Sénégal",
  logoUrl: "https://abdou-diallo.samacvpro.dev/images/profiles/profile1.png", // Temporaire
  websiteUrl: "https://abdou-diallo.samacvpro.dev"
});

/**
 * Créer une facture pour paiement par carte (Redirection)
 */
export const createInvoice = async (amount, description, cancelUrl, returnUrl) => {
  return new Promise((resolve, reject) => {
    const invoice = new paydunya.CheckoutInvoice(setup, store);
    invoice.addItem("Service CV Premium", 1, amount, amount, description);
    invoice.totalAmount = amount;
    
    // Configurer les URLs de redirection
    invoice.addCustomData('description', description);
    invoice.cancelUrl = cancelUrl;
    invoice.returnUrl = returnUrl;

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
  const url = 'https://app.paydunya.com/api/v1/softpay/create-payment';
  
  // Le provider pour le Softpay (orange-money-senegal, wave-senegal, free-money-senegal)
  const walletMap = {
    'orange': 'orange-money-senegal',
    'wave': 'wave-senegal',
    'free': 'free-money-senegal'
  };

  const payload = {
    payment_token: "", // Will be generated first
    phone_number: phone,
    wallet: walletMap[walletProvider],
    account_alias: accountAlias || phone
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
    console.error('PayDunya API Error Data:', error.data || error);
    const apiMsg = error.data && error.data.response_text ? ` (${error.data.response_text})` : '';
    throw new Error('Erreur lors du paiement mobile : ' + error.message + apiMsg);
  }
};
