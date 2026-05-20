import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Smartphone, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function PaymentModal({ isOpen, onClose, onSuccess, templateId, templateName, price }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('wave'); // 'wave', 'orange', 'card'
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMethod('wave');
      setPhone('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setError('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setError('');
    setStep(3); // Go to processing screen
    
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
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Une erreur est survenue lors du paiement.');
      setIsProcessing(false);
      setStep(1); // Go back if error
    }
  };

  const isFormValid = () => {
    if (method === 'wave' || method === 'orange') {
      return phone.length >= 9;
    }
    if (method === 'card') {
      return cardNumber.replace(/\s/g, '').length >= 15 && cardExpiry.length >= 5 && cardCvc.length >= 3;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 lg:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="w-full max-w-5xl bg-[#f4f5f5] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col lg:flex-row my-auto"
      >
        
        {/* Left Panel */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col relative min-h-[500px]">
          {step === 1 && !isProcessing && (
            <button onClick={onClose} className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 transition-colors z-10 font-medium text-sm flex items-center gap-2">
              ✕ Fermer
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                className="flex flex-col h-full mt-10 lg:mt-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez un moyen de paiement</h2>
                
                <div className="space-y-3 mb-8">
                  {/* Wave Option */}
                  <label className={`flex items-center p-4 bg-white border ${method === 'wave' ? 'border-[#082f1f] ring-1 ring-[#082f1f]' : 'border-gray-200'} rounded-xl cursor-pointer transition-all hover:border-gray-300 shadow-sm`}>
                    <input type="radio" name="method" value="wave" checked={method === 'wave'} onChange={() => setMethod('wave')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${method === 'wave' ? 'border-[#082f1f]' : 'border-gray-300'}`}>
                      {method === 'wave' && <div className="w-2.5 h-2.5 bg-[#082f1f] rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">Wave Mobile Money</div>
                    </div>
                    <div className="w-[70px] lg:w-20">
                      <svg viewBox="0 0 100 40" className="w-full h-auto">
                        <rect width="100" height="40" rx="6" fill="#15d0f6" />
                        <text x="50" y="26" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" textAnchor="middle">wave</text>
                      </svg>
                    </div>
                  </label>

                  {/* Orange Money Option */}
                  <label className={`flex items-center p-4 bg-white border ${method === 'orange' ? 'border-[#082f1f] ring-1 ring-[#082f1f]' : 'border-gray-200'} rounded-xl cursor-pointer transition-all hover:border-gray-300 shadow-sm`}>
                    <input type="radio" name="method" value="orange" checked={method === 'orange'} onChange={() => setMethod('orange')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${method === 'orange' ? 'border-[#082f1f]' : 'border-gray-300'}`}>
                      {method === 'orange' && <div className="w-2.5 h-2.5 bg-[#082f1f] rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">Orange Money</div>
                    </div>
                    <div className="w-[70px] lg:w-20">
                      <svg viewBox="0 0 100 40" className="w-full h-auto">
                        <rect width="100" height="40" rx="6" fill="black" />
                        <rect width="28" height="28" x="6" y="6" rx="4" fill="#ff7900" />
                        <text x="65" y="20" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" textAnchor="middle">Orange</text>
                        <text x="65" y="30" fill="#ff7900" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" textAnchor="middle">Money</text>
                      </svg>
                    </div>
                  </label>

                  {/* Visa/Mastercard Option */}
                  <label className={`flex items-center p-4 bg-white border ${method === 'card' ? 'border-[#082f1f] ring-1 ring-[#082f1f]' : 'border-gray-200'} rounded-xl cursor-pointer transition-all hover:border-gray-300 shadow-sm`}>
                    <input type="radio" name="method" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${method === 'card' ? 'border-[#082f1f]' : 'border-gray-300'}`}>
                      {method === 'card' && <div className="w-2.5 h-2.5 bg-[#082f1f] rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">Carte bancaire</div>
                    </div>
                    <div className="flex gap-1 lg:gap-2 w-[70px] lg:w-20">
                      <svg viewBox="0 0 40 24" className="w-1/2 h-auto">
                        <rect width="40" height="24" rx="4" fill="#f0f2f5" />
                        <text x="20" y="16" fill="#1434CB" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold" fontSize="10" textAnchor="middle">VISA</text>
                      </svg>
                      <svg viewBox="0 0 40 24" className="w-1/2 h-auto">
                        <rect width="40" height="24" rx="4" fill="#f0f2f5" />
                        <circle cx="15" cy="12" r="7" fill="#EB001B" />
                        <circle cx="25" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" />
                      </svg>
                    </div>
                  </label>
                </div>

                {/* Dynamic Inputs */}
                <div className="mt-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du paiement</h3>
                  
                  {method === 'wave' || method === 'orange' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Smartphone size={18} className="text-gray-400" />
                        </div>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s+]/g, ''))}
                          placeholder={method === 'wave' ? "Ex: 77 123 45 67" : "Ex: 78 123 45 67"}
                          className="w-full pl-11 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#082f1f] focus:border-[#082f1f] outline-none text-lg bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                            setCardNumber(formatted.slice(0, 19));
                          }}
                          placeholder="0000 0000 0000 0000" 
                          className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082f1f] bg-white text-lg text-gray-900 placeholder-gray-400" 
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 3) {
                                val = val.substring(0, 2) + '/' + val.substring(2, 4);
                              } else if (val.length === 2 && cardExpiry.length < e.target.value.length) {
                                val = val + '/';
                              }
                              setCardExpiry(val.slice(0, 5));
                            }}
                            placeholder="MM/AA" 
                            className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082f1f] bg-white text-lg text-gray-900 placeholder-gray-400" 
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                          <input 
                            type="text" 
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                            placeholder="123" 
                            className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082f1f] bg-white text-lg text-gray-900 placeholder-gray-400" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                      {error}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[#082f1f] rounded-full animate-ping opacity-20"></div>
                  <div className="w-20 h-20 bg-[#082f1f] rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <Loader2 size={32} className="animate-spin text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Paiement en cours...</h3>
                <p className="text-gray-600 max-w-[280px]">
                  {method === 'card' 
                    ? "Veuillez patienter pendant que nous sécurisons votre transaction bancaire." 
                    : `Une notification a été envoyée sur votre téléphone. Veuillez valider le paiement ${method === 'wave' ? 'Wave' : 'Orange Money'}.`}
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Paiement réussi !</h3>
                <p className="text-gray-600">
                  Merci pour votre confiance. Le modèle est débloqué.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel (Summary) */}
        <div className="w-full lg:w-[420px] bg-[#082f1f] text-white p-6 lg:p-10 flex flex-col shrink-0">
          <h2 className="text-lg font-medium text-gray-300 mb-8 lg:mb-12">Résumé de la commande</h2>
          
          <div className="mb-8 lg:mb-12">
            <div className="text-sm text-[#a0b2a8] mb-2">Total de la commande</div>
            <div className="text-4xl lg:text-5xl font-semibold tracking-tight">{price} F</div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm lg:text-base">
              <span className="text-[#a0b2a8]">Modèle</span>
              <span className="font-medium">{templateName}</span>
            </div>
            <div className="flex justify-between text-sm lg:text-base">
              <span className="text-[#a0b2a8]">Taxes</span>
              <span className="font-medium">Incluses</span>
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total à payer</span>
              <span>{price} F</span>
            </div>
          </div>

          <div className="mt-auto pt-8 lg:pt-0">
            <button 
              disabled={isProcessing || step === 4 || !isFormValid()}
              onClick={handleProcessPayment}
              className="w-full py-4 lg:py-5 bg-white text-[#082f1f] rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/20"
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20} /> Traitement...</>
              ) : step === 4 ? (
                <>Validé !</>
              ) : (
                <>Payer {price} F</>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-[#a0b2a8] mt-4">
              <Lock size={12} /> Paiement 100% sécurisé
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
