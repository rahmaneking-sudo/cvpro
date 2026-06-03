import express from 'express';
import { createCardPayment, processMobilePayment, handleWebhook, checkPaymentStatus, createManualWavePayment, validateManualPayment } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Créer une facture pour paiement par carte (nécessite d'être connecté)
router.post('/create-invoice', authMiddleware, createCardPayment);

// Lancer un paiement Mobile Money en Direct (nécessite d'être connecté)
router.post('/direct-charge', authMiddleware, processMobilePayment);

// Vérifier le statut d'un paiement (polling)
router.get('/status/:token', authMiddleware, checkPaymentStatus);

// Webhook appelé par PayDunya pour confirmer le paiement en arrière-plan
router.post('/webhook', handleWebhook);

// --- Wave Business (Manuel) ---
router.post('/manual-wave', authMiddleware, createManualWavePayment);
router.get('/validate-manual/:token', validateManualPayment);

export default router;
