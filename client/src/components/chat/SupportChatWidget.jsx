import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../store/AuthContext';

export default function SupportChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);

  // Listen for external open events (e.g. from Navbar bell)
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-support-chat', handleOpenChat);
    return () => window.removeEventListener('open-support-chat', handleOpenChat);
  }, []);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Poll for messages
  useEffect(() => {
    let intervalId;

    const fetchSession = async () => {
      try {
        const res = await api.get('/chat/session');
        if (res.data.success && res.data.session) {
          setSession(res.data.session);
          setMessages(res.data.session.messages || []);
        }
      } catch (error) {
        console.error('Chat fetch error:', error);
      }
    };

    if (user && isOpen) {
      setIsLoading(true);
      fetchSession().finally(() => setIsLoading(false));
      intervalId = setInterval(fetchSession, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, isOpen]);

  // Mark as read when chat is opened
  useEffect(() => {
    if (isOpen && user) {
      api.put('/chat/read').catch(e => console.error(e));
    }
  }, [isOpen, user]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Optimistic UI update
    const optimisticMsg = {
      id: Date.now().toString(),
      sender: 'user',
      content: content,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await api.post('/chat/message', { content });
      if (res.data.success && res.data.autoReplyMessage) {
        setMessages(prev => [...prev, res.data.autoReplyMessage]);
      }
    } catch (error) {
      console.error('Send message error:', error);
      // Revert if error
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null; // Only show for logged in users

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 h-[400px] max-h-[60vh] bg-[var(--color-charcoal)] border border-[var(--color-champagne)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-champagne)] p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-[var(--color-obsidian)]">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold leading-tight">Support Client</h3>
                  <p className="text-xs opacity-80">Nous répondons rapidement</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-obsidian)] hover:bg-black/10 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-obsidian)]">
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="animate-spin text-[var(--color-champagne)]" size={24} />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-[var(--color-white-muted)] text-sm my-10">
                  Posez votre question, notre équipe est là pour vous aider !
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-[var(--color-champagne)] text-black rounded-br-sm' 
                          : 'bg-white/10 text-white rounded-bl-sm border border-white/5'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-[var(--color-white-muted)] mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[var(--color-charcoal)] border-t border-[var(--color-champagne)]/20 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-champagne)] transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="w-10 h-10 rounded-full bg-[var(--color-champagne)] text-black flex items-center justify-center shrink-0 disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  <Send size={16} className="ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--color-gold-dark)] to-[var(--color-champagne)] shadow-[0_0_20px_rgba(201,169,110,0.4)] flex flex-col items-center justify-center text-[var(--color-obsidian)]"
      >
        {isOpen ? <X size={24} /> : (
          <>
            <MessageCircle size={22} className="mb-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
