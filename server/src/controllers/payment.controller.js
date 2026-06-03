import { createInvoice, createDirectPay, checkInvoiceStatus } from '../services/paydunya.service.js';
import prisma from '../utils/prisma.js';
import crypto from 'crypto';

// Route pour le paiement par carte (Redirection)
export const createCardPayment = async (req, res) => {
  try {
    const { amount, description, templateId, productType } = req.body;
    
    // Ensure amount is a valid number, even if passed as a string like "5 000"
    const parsedAmount = amount ? Number(String(amount).replace(/[^\d]/g, '')) : 5000;
    
    // Configurer l'URL de retour (où le client atterrit après avoir payé)
    // On utilise TOUJOURS le domaine de production (pas CLIENT_URL qui peut être localhost)
    const clientUrl = 'https://samacvpro.com';
    const returnUrl = `${clientUrl}/dashboard?payment=success`;
    const cancelUrl = `${clientUrl}/dashboard?payment=cancel`;

    const invoice = await createInvoice(parsedAmount || 5000, description || "Abonnement CV Premium", cancelUrl, returnUrl);
    
    // Enregistrer le paiement en attente dans la base de données
    if (templateId && req.userId) {
      await prisma.purchase.create({
        data: {
          userId: req.userId,
          product: productType || 'cv_template',
          productId: templateId,
          provider: 'paydunya',
          currency: 'XOF',
          amount: parsedAmount || 5000,
          status: 'pending',
          webhookId: invoice.token
        }
      });
    }
    
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
    const data = req.body?.data || req.body;
    
    if (!data) {
      return res.status(200).send('OK'); // Always return 200 to PayDunya to prevent loops
    }

    const status = data.status; // 'completed', 'failed', 'cancelled'
    const invoiceToken = data.invoice?.token || data.token;
    
    if (status === 'completed' && invoiceToken) {
      console.log(`Paiement validé pour la facture ${invoiceToken}`);
      // Mettre à jour la base de données de l'utilisateur via Prisma
      await prisma.purchase.updateMany({
        where: { webhookId: invoiceToken },
        data: { status: 'completed' }
      });
    }

    // PayDunya attend un statut 200 pour confirmer la réception du webhook
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur Webhook PayDunya:', error);
    // Return 200 anyway so PayDunya doesn't crash the user's frontend redirect
    res.status(200).send('Erreur processée');
  }
};

// --- Wave Business (Manuel) ---

export const createManualWavePayment = async (req, res) => {
  try {
    const { amount, phone, templateId, productType, templateName } = req.body;
    
    const parsedAmount = amount ? Number(String(amount).replace(/[^\d]/g, '')) : 5000;
    
    // Generate a unique token for magic link
    const magicToken = crypto.randomBytes(32).toString('hex');
    
    // Save pending purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId: req.userId,
        product: productType || 'cv_template',
        productId: templateId,
        provider: 'wave_manual',
        currency: 'XOF',
        amount: parsedAmount,
        status: 'pending_verification',
        webhookId: magicToken // We use webhookId field to store our magic token
      }
    });

    // Send Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    
    if (botToken && chatId) {
      // Toujours utiliser l'URL de production pour le bouton Telegram car
      // l'API de Telegram REFUSE formellement les URLs "localhost" dans les boutons (Erreur 400).
      // Comme la base de données est la même (Supabase), le lien marchera même pour les tests locaux !
      const validateUrl = `https://samacvpro.com/api/payments/validate-manual/${magicToken}`;
      
      const message = `🔔 <b>Nouveau Paiement Wave (En Attente)</b> 🔔\n\n` +
                      `📞 Numéro Client: <code>${phone}</code>\n` +
                      `💰 Montant: <b>${parsedAmount} FCFA</b>\n` +
                      `🛍 Produit: ${productType.replace('_', ' ')} (${templateName || templateId})`;

      // Dans un environnement Serverless (Vercel), IL FAUT await sinon la requête est tuée
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: "✅ APPROUVER ET DÉBLOQUER LE DOCUMENT", url: validateUrl }]
            ]
          }
        })
      });
      
      if (!tgRes.ok) {
        const tgErr = await tgRes.text();
        console.error('Telegram API Error:', tgErr);
      }
    }

    res.json({
      success: true,
      message: "Votre demande a été prise en compte. Elle sera validée dans quelques minutes.",
      token: magicToken
    });
  } catch (error) {
    console.error('Erreur Wave Manuel:', error);
    res.status(500).json({ success: false, message: "Erreur lors de la création de la demande." });
  }
};

export const validateManualPayment = async (req, res) => {
  try {
    const { token } = req.params;
    
    const purchase = await prisma.purchase.findFirst({
      where: { webhookId: token, status: 'pending_verification' }
    });

    if (!purchase) {
      return res.status(404).send('<h1>Lien invalide ou paiement déjà validé.</h1>');
    }

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: 'completed' }
    });

    // Send success message to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (botToken && chatId) {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `✅ <b>Paiement Validé avec succès!</b>\nLe CV a été débloqué pour ce client.`,
          parse_mode: 'HTML'
        })
      }).catch(err => console.error(err));
    }

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px; color: #082f1f; background: #f4f5f5; min-height: 100vh;">
        <div style="background: white; max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
          <h1 style="color: #16a34a; margin-top: 0;">Paiement Validé !</h1>
          <p style="font-size: 18px; color: #666; line-height: 1.5;">Le paiement a bien été enregistré. Le CV est maintenant débloqué pour le client.</p>
          <p style="color: #999; font-size: 14px; margin-top: 40px;">Tu peux fermer cette page et retourner sur Telegram.</p>
        </div>
      </div>
    `);
  } catch (error) {
    console.error('Erreur Validation Wave Manuel:', error);
    res.status(500).send('Erreur lors de la validation.');
  }
};
