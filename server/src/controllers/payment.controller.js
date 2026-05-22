import { createInvoice, createDirectPay, checkInvoiceStatus } from '../services/paydunya.service.js';

// Route pour le paiement par carte (Redirection)
export const createCardPayment = async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    // Ensure amount is a valid number, even if passed as a string like "5 000"
    const parsedAmount = amount ? Number(String(amount).replace(/[^\d]/g, '')) : 5000;
    
    // Configurer l'URL de retour (où le client atterrit après avoir payé)
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const returnUrl = `${clientUrl}/dashboard?payment=success`;
    const cancelUrl = `${clientUrl}/dashboard?payment=cancel`;

    const invoice = await createInvoice(parsedAmount || 5000, description || "Abonnement CV Premium", cancelUrl, returnUrl);
    
    res.json({
      success: true,
      url: invoice.url,
      token: invoice.token
    });
  } catch (error) {
    console.error('Erreur PayDunya (Card):', error);
    res.status(500).json({ success: false, message: error.message || "Erreur de génération de facture" });
  }
};

// Route pour le paiement Mobile Money (Direct Pay)
export const processMobilePayment = async (req, res) => {
  try {
    const { amount, phone, provider } = req.body;
    
    // Ensure amount is a valid number, even if passed as a string like "5 000"
    const parsedAmount = amount ? Number(String(amount).replace(/[^\d]/g, '')) : 5000;
    
    if (!phone || !provider) {
      return res.status(400).json({ success: false, message: "Numéro de téléphone et opérateur requis" });
    }

    const result = await createDirectPay(parsedAmount || 5000, phone, provider);
    
    if (result.success) {
      res.json({ success: true, message: "Veuillez valider le paiement sur votre téléphone.", token: result.token });
    } else {
      res.status(400).json({ success: false, message: result.message || "Le paiement a échoué" });
    }
  } catch (error) {
    console.error('Erreur PayDunya (Mobile):', error);
    res.status(500).json({ success: false, message: error.message || "Erreur lors du paiement mobile" });
  }
};

// Vérifier le statut d'un paiement (Polling depuis le frontend)
export const checkPaymentStatus = async (req, res) => {
  try {
    const { token } = req.params;
    
    const data = await checkInvoiceStatus(token);
    
    if (data.status === 'completed') {
      res.json({ success: true, status: 'completed' });
    } else if (data.status === 'failed' || data.status === 'cancelled') {
      res.json({ success: false, status: data.status });
    } else {
      res.json({ success: true, status: 'pending' }); // still pending
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook / IPN pour valider le paiement asynchrone
export const handleWebhook = async (req, res) => {
  try {
    const { data, hash } = req.body;
    
    // TODO: Dans un environnement de production, il faut vérifier la validité du hash 
    // envoyé par PayDunya pour s'assurer que c'est bien eux qui envoient la requête.
    
    const status = data.status; // 'completed', 'failed', 'cancelled'
    const invoiceToken = data.invoice.token;
    
    if (status === 'completed') {
      console.log(`Paiement validé pour la facture ${invoiceToken}`);
      // TODO: Mettre à jour la base de données de l'utilisateur via Prisma
      // ex: await prisma.user.update(...)
    }

    // PayDunya attend un statut 200 pour confirmer la réception du webhook
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur Webhook PayDunya:', error);
    res.status(500).send('Erreur');
  }
};
