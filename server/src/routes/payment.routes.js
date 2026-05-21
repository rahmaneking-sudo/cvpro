import express from 'express';
import { createCardPayment, processMobilePayment, handleWebhook } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // Assuming you have an auth middleware

const router = express.Router();

// Créer une facture pour paiement par carte (nécessite d'être connecté)
router.post('/create-invoice', protect, createCardPayment);

// Lancer un paiement Mobile Money en Direct (nécessite d'être connecté)
router.post('/direct-charge', protect, processMobilePayment);

// Webhook appelé par PayDunya pour confirmer le paiement en arrière-plan
router.post('/webhook', handleWebhook);

export default router;
