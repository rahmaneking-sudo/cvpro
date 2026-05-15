import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Smartphone, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function PaymentModal({ isOpen, onClose, onSuccess, templateId, templateName, price }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null); // 'orange' or 'wave'
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMethod(null);
      setPhone('');
      setPin('');
      setError('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Simulate network delay for realism (waiting for user to validate on their phone)
      await new Promise(resolve => setTimeout(resolve, 4500));
      
      // Hit the simulation API endpoint
      await api.post('/cv/purchase/simulate', { templateId });
      
      setStep(4); // Success step
      
      // Auto-close and trigger success after a short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Une erreur est survenue lors du paiement.');
      setIsProcessing(false);
    }
  };

  const methodColors = {
    orange: { bg: '#FF7900', text: '#fff', border: '#E66D00' },
    wave: { bg: '#1C1D22', text: '#1CE9B6', border: '#1CE9B6' }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="w-full max-w-md bg-[var(--color-obsidian)] border border-[rgba(201,169,110,0.3)] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[rgba(201,169,110,0.1)] to-transparent shrink-0">
          {step > 1 && step < 4 && !isProcessing && (
            <button onClick={() => setStep(step - 1)} className="absolute top-6 left-6 text-[var(--color-white-muted)] hover:text-white">
              <ArrowLeft size={20} />
            </button>
          )}
          {!isProcessing && step !== 4 && (
            <button onClick={onClose} className="absolute top-6 right-6 text-[var(--color-white-muted)] hover:text-white">
              ✕
            </button>
          )}
          <h3 className={`text-xl font-bold text-[var(--color-ivory)] mb-2 ${step > 1 ? 'text-center' : ''}`} style={{ fontFamily: 'var(--font-serif)' }}>
            Débloquer l'Export
          </h3>
          <p className={`text-sm text-[var(--color-white-muted)] ${step > 1 ? 'text-center' : ''}`}>
            {templateName}
          </p>
        </div>

        {/* Dynamic Content area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Choose Method */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[var(--color-ivory)] font-medium">Prix total</span>
                  <span className="text-2xl font-bold text-[var(--color-champagne)]">{price} F</span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[var(--color-white-muted)] text-center mb-4">Choisissez votre moyen de paiement</p>
                  
                  <button 
                    onClick={() => { setMethod('orange'); setStep(2); }} 
                    className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#FF7900] text-white hover:bg-[#E66D00] transition-colors shadow-lg shadow-[#FF7900]/20"
                  >
                    Payer avec Orange Money
                  </button>
                  
                  <button 
                    onClick={() => { setMethod('wave'); setStep(2); }} 
                    className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#1C1D22] text-[#1CE9B6] border border-[#1CE9B6]/30 hover:bg-[#1CE9B6]/10 transition-colors shadow-lg shadow-[#1CE9B6]/10"
                  >
                    Payer avec Wave
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 mt-4">
                  <ShieldCheck size={12} /> Paiement 100% sécurisé
                </div>
              </motion.div>
            )}

            {/* STEP 2: Phone Number */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: methodColors[method].bg, color: methodColors[method].text }}>
                    <Smartphone size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--color-ivory)]">Numéro de téléphone</h4>
                  <p className="text-xs text-[var(--color-white-muted)]">
                    Entrez votre numéro {method === 'orange' ? 'Orange Money' : 'Wave'}
                  </p>
                </div>

                <div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s+]/g, ''))}
                    placeholder="Ex: 77 123 45 67"
                    className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-center text-xl text-[var(--color-ivory)] tracking-widest placeholder:text-white/20 focus:outline-none focus:border-[var(--color-champagne)]"
                    autoFocus
                  />
                </div>

                <button 
                  disabled={phone.length < 9 || isProcessing}
                  onClick={() => {
                    setStep(3);
                    handleProcessPayment();
                  }}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-[var(--color-champagne)] text-black disabled:opacity-50 disabled:grayscale transition-all hover:bg-[var(--color-gold-light)]"
                >
                  Valider le numéro
                </button>
              </motion.div>
            )}

            {/* STEP 3: Waiting for Phone Validation (Push USSD) */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 flex flex-col items-center py-6">
                <div className="relative w-20 h-20 flex items-center justify-center mb-4">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: `${methodColors[method].bg}30` }}
                  />
                  <div className="w-16 h-16 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: methodColors[method].bg, color: methodColors[method].text }}>
                    <Smartphone size={32} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[var(--color-obsidian)] rounded-full p-1 border border-white/10 z-20">
                    <Loader2 size={16} className="animate-spin text-[var(--color-champagne)]" />
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <h4 className="text-lg font-bold text-[var(--color-ivory)]">Vérifiez votre téléphone</h4>
                  <p className="text-sm text-[var(--color-white-muted)] leading-relaxed max-w-[280px] mx-auto">
                    Une notification a été envoyée sur votre compte <strong style={{ color: methodColors[method].text }}>{method === 'orange' ? 'Orange Money' : 'Wave'}</strong>. 
                  </p>
                  <p className="text-xs text-[var(--color-white-muted)]/70 max-w-[280px] mx-auto bg-white/5 p-3 rounded-lg border border-white/10">
                    Veuillez composer votre code secret sur votre téléphone pour valider le paiement de <strong className="text-[var(--color-champagne)]">{price} F</strong>.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 space-y-4">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-green-400"
                >
                  <CheckCircle2 size={64} />
                </motion.div>
                <h4 className="text-xl font-bold text-[var(--color-ivory)]">Paiement Effectué !</h4>
                <p className="text-sm text-center text-[var(--color-white-muted)]">
                  Merci pour votre confiance. Vous pouvez maintenant télécharger.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
