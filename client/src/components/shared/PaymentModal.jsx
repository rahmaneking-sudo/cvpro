import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Smartphone, Lock, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { getUserCurrency, convertFromXOF, parseBasePrice } from '../../utils/currency';

export default function PaymentModal({ isOpen, onClose, onSuccess, templateId, templateName, price, productType = 'cv_template' }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('wave'); // 'wave', 'orange', 'card'
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [displayPrice, setDisplayPrice] = useState(null);

  // FEATURE FLAG: Mettre à false pour utiliser Wave Manuel, true pour PayDunya
  const USE_PAYDUNYA = true;
  // Numéro Wave Business (à remplacer par ton vrai numéro)
  const WAVE_BUSINESS_NUMBER = "SN 84 67 03 97";

  // Fetch dynamic currency on open
  useEffect(() => {
    if (isOpen) {
      const fetchCurrency = async () => {
        const basePrice = parseBasePrice(price);
        const userCurr = await getUserCurrency();
        const converted = await convertFromXOF(basePrice, userCurr);
        setDisplayPrice(converted);
      };
      fetchCurrency();
    }
  }, [isOpen, price]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    
    try {
      if (USE_PAYDUNYA) {
        setStep(3);
        const descPrefix = productType === 'portfolio_premium' ? 'Achat Portfolio Premium' : 'Achat CV Premium';
        const basePrice = parseBasePrice(price);
        const response = await api.post('/payments/create-invoice', {
          amount: basePrice || 5000,
          description: `${descPrefix} : ${templateName || 'Modèle'}`,
          templateId,
          productType
        });
        
        if (response.data.success && response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('Impossible de générer le lien de paiement sécurisé.');
        }
      } else {
        // Mode Manuel Wave
        if (!phone || phone.length < 9) {
          throw new Error("Veuillez entrer un numéro de téléphone valide.");
        }
        
        setStep(3);
        const basePrice = parseBasePrice(price);
        const response = await api.post('/payments/manual-wave', {
          amount: basePrice || 5000,
          phone,
          templateId,
          productType,
          templateName
        });

        if (response.data.success) {
          setStep(4); // Success screen (pending verification)
        } else {
          throw new Error(response.data.message || 'Erreur lors du paiement.');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors du paiement.');
      setIsProcessing(false);
      setStep(1); // Go back if error
    }
  };

  const isFormValid = () => {
    if (USE_PAYDUNYA) return true;
    return phone && phone.trim().length >= 9;
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-start lg:items-center justify-center p-0 lg:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="w-full max-w-5xl bg-[#f4f5f5] min-h-screen lg:min-h-0 lg:rounded-2xl shadow-2xl overflow-hidden relative flex flex-col lg:flex-row m-auto"
      >
        
        {/* Left Panel */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col relative min-h-[500px]">
          {step === 1 && !isProcessing && (
            <button onClick={onClose} className="absolute top-4 right-4 lg:top-6 lg:left-6 lg:right-auto text-gray-500 hover:text-gray-900 transition-colors z-50 font-medium text-sm flex items-center gap-2 bg-white/80 lg:bg-transparent px-3 py-1.5 lg:p-0 rounded-full shadow-sm lg:shadow-none">
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
                className="flex flex-col h-full mt-6 lg:mt-6"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 pr-10 lg:pr-0">Choisissez un moyen de paiement</h2>
                
                {USE_PAYDUNYA ? (
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

                    {/* Free Money Option */}
                    <label className={`flex items-center p-4 bg-white border ${method === 'free' ? 'border-[#082f1f] ring-1 ring-[#082f1f]' : 'border-gray-200'} rounded-xl cursor-pointer transition-all hover:border-gray-300 shadow-sm`}>
                      <input type="radio" name="method" value="free" checked={method === 'free'} onChange={() => setMethod('free')} className="hidden" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${method === 'free' ? 'border-[#082f1f]' : 'border-gray-300'}`}>
                        {method === 'free' && <div className="w-2.5 h-2.5 bg-[#082f1f] rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm lg:text-base">Free Money</div>
                      </div>
                      <div className="w-[70px] lg:w-20">
                        <svg viewBox="0 0 100 40" className="w-full h-auto">
                          <rect width="100" height="40" rx="6" fill="#E3000F" />
                          <text x="50" y="26" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" textAnchor="middle">Free</text>
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
                ) : (
                  <div className="space-y-6 mb-8">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
                      <div className="w-16 h-16 bg-[#15d0f6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone size={32} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Paiement via Wave Business</h3>
                      <p className="text-gray-600 mb-4">
                        Veuillez transférer le montant de <span className="font-bold text-[#082f1f]">{displayPrice ? `${displayPrice.amount} FCFA` : '...'}</span> au numéro ci-dessous :
                      </p>
                      <div className="bg-white py-3 px-6 rounded-lg shadow-sm inline-block border border-gray-200 mb-4">
                        <span className="text-2xl font-black tracking-wider text-[#15d0f6]">{WAVE_BUSINESS_NUMBER}</span>
                      </div>
                      <p className="text-sm text-gray-500">Nom du compte : <span className="font-medium">Sama CV Pro</span></p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de téléphone utilisé pour le paiement
                      </label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 77 123 45 67"
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#082f1f] focus:ring-1 focus:ring-[#082f1f]"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">Nous utiliserons ce numéro pour vérifier votre transaction.</p>
                    </div>
                  </div>
                )}

                {/* Dynamic Inputs */}
                <div className="mt-auto">
                  {USE_PAYDUNYA && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du paiement</h3>
                      <div className="space-y-4 text-center py-6">
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <Lock size={32} className="text-[#082f1f]" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900">Paiement 100% Sécurisé</h4>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                          Pour des raisons de sécurité, nous ne stockons aucune donnée de paiement sur notre site.
                          <br/><br/>
                          En cliquant sur "Payer", vous serez redirigé vers la page certifiée de <strong>PayDunya</strong> pour finaliser votre transaction en toute sécurité avec le moyen de paiement de votre choix.
                          {displayPrice && displayPrice.currency !== 'XOF' && (
                            <span className="block mt-2 text-[#082f1f] font-semibold">
                              (La transaction sera effectuée en Francs CFA pour un montant équivalent via PayDunya)
                            </span>
                          )}
                        </p>
                      </div>
                    </>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Traitement en cours...</h3>
                <p className="text-gray-600 max-w-[280px]">
                  {USE_PAYDUNYA ? (
                    method === 'card' 
                      ? "Veuillez patienter pendant que nous sécurisons votre transaction bancaire." 
                      : `Une notification a été envoyée sur votre téléphone. Veuillez valider le paiement ${method === 'wave' ? 'Wave' : method === 'orange' ? 'Orange Money' : 'Free Money'}.`
                  ) : (
                    "Veuillez patienter pendant que nous envoyons votre demande de validation..."
                  )}
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
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Demande envoyée !</h3>
                <p className="text-gray-600">
                  Votre paiement est en cours de vérification. Vous recevrez l'accès à votre modèle dès sa validation (généralement en moins de 5 minutes). Vous pouvez fermer cette fenêtre.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel (Summary) */}
        <div className="w-full lg:w-[420px] bg-[#082f1f] text-white p-6 lg:p-10 flex flex-col shrink-0 order-first lg:order-last">
          <h2 className="text-lg font-medium text-gray-300 mb-6 lg:mb-12">Résumé de la commande</h2>
          
          <div className="mb-8 lg:mb-12">
            <div className="text-sm text-[#a0b2a8] mb-2">Total de la commande</div>
            {displayPrice ? (
              <div className="text-4xl lg:text-5xl font-semibold tracking-tight">{displayPrice.amount} {displayPrice.symbol}</div>
            ) : (
              <div className="text-4xl lg:text-5xl font-semibold tracking-tight"><Loader2 className="animate-spin inline" size={32} /></div>
            )}
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
              <span>{displayPrice ? `${displayPrice.amount} ${displayPrice.symbol}` : '...'}</span>
            </div>
          </div>

          <div className="mt-4 lg:mt-auto pt-6 lg:pt-0">
            <button 
              disabled={isProcessing || step === 4 || !isFormValid()}
              onClick={handleProcessPayment}
              className="w-full py-4 lg:py-5 bg-white text-[#082f1f] rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/20"
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20} /> Traitement...</>
              ) : step === 4 ? (
                <>En cours de vérification</>
              ) : (
                <>Valider le paiement de {displayPrice ? `${displayPrice.amount} ${displayPrice.symbol}` : ''}</>
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
